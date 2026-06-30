import prisma from '../../shared/db.js'
import { notFound, badRequest } from '../../shared/utils/ApiError.js'

const ownedOrThrow = async (userId, id) => {
  const activity = await prisma.activity.findFirst({ where: { id, userId, deletedAt: null } })
  if (!activity) throw notFound('Activity not found')
  return activity
}

// Every attached project must belong to the user (and be live).
const assertProjectsOwned = async (userId, projectIds = []) => {
  const unique = [...new Set(projectIds)]
  if (unique.length === 0) return
  const count = await prisma.project.count({
    where: { id: { in: unique }, userId, deletedAt: null },
  })
  if (count !== unique.length) throw notFound('Project not found')
}

// completedAt is derived from status, never set directly by the client.
const completedAtFor = (status) => (status === 'DONE' ? new Date() : null)

// Pull join rows, dropping soft-deleted projects, and flatten to plain objects.
const projectInclude = {
  projects: {
    where: { project: { deletedAt: null } },
    include: { project: { select: { id: true, name: true, color: true, icon: true } } },
  },
}
const flatten = (activity) => ({
  ...activity,
  projects: activity.projects.map((link) => link.project),
})

export const list = async (userId, filters = {}) => {
  const { date, from, to, projectId, status } = filters

  const where = { userId, deletedAt: null }
  // An activity spans [startDate, endDate]; a day/range matches on overlap.
  if (date) {
    where.startDate = { lte: date }
    where.endDate = { gte: date }
  } else if (from || to) {
    if (to) where.startDate = { lte: to }
    if (from) where.endDate = { gte: from }
  }
  if (projectId) where.projects = { some: { projectId } }
  if (status) where.status = status

  const activities = await prisma.activity.findMany({
    where,
    orderBy: [{ startDate: 'asc' }, { priority: 'desc' }, { createdAt: 'asc' }],
    include: projectInclude,
  })
  return activities.map(flatten)
}

export const get = async (userId, id) => {
  const activity = await prisma.activity.findFirst({
    where: { id, userId, deletedAt: null },
    include: projectInclude,
  })
  if (!activity) throw notFound('Activity not found')
  return flatten(activity)
}

export const create = async (userId, data) => {
  const { projectIds = [], ...fields } = data
  await assertProjectsOwned(userId, projectIds)

  const activity = await prisma.activity.create({
    data: {
      ...fields,
      userId,
      // A task with no explicit end is single-day.
      endDate: fields.endDate ?? fields.startDate,
      completedAt: completedAtFor(fields.status),
      projects: { create: [...new Set(projectIds)].map((projectId) => ({ projectId })) },
    },
    include: projectInclude,
  })
  return flatten(activity)
}

export const update = async (userId, id, data) => {
  const current = await ownedOrThrow(userId, id)
  const { projectIds, ...fields } = data
  if (projectIds) await assertProjectsOwned(userId, projectIds)

  // Validate the range against existing values when only one date changes.
  const start = fields.startDate ?? current.startDate
  const end = fields.endDate ?? current.endDate
  if (end < start) throw badRequest('endDate must be on or after startDate')

  const patch = { ...fields }
  // Only recompute completedAt when status is part of the update.
  if ('status' in fields) patch.completedAt = completedAtFor(fields.status)
  // Replace the whole project set when provided.
  if (projectIds) {
    patch.projects = {
      deleteMany: {},
      create: [...new Set(projectIds)].map((projectId) => ({ projectId })),
    }
  }

  const activity = await prisma.activity.update({
    where: { id },
    data: patch,
    include: projectInclude,
  })
  return flatten(activity)
}

// Soft delete: keep the row, mark it deleted. Reads filter it out.
export const remove = async (userId, id) => {
  await ownedOrThrow(userId, id)
  await prisma.activity.update({ where: { id }, data: { deletedAt: new Date() } })
}
