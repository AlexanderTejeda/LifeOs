import prisma from '../../shared/db.js'
import { notFound, badRequest } from '../../shared/utils/ApiError.js'

const ownedOrThrow = async (userId, id) => {
  const activity = await prisma.activity.findFirst({ where: { id, userId, deletedAt: null } })
  if (!activity) throw notFound('Activity not found')
  return activity
}

const assertCategoryOwned = async (userId, categoryId) => {
  if (!categoryId) return
  const category = await prisma.activityCategory.findFirst({
    where: { id: categoryId, userId, deletedAt: null },
  })
  if (!category) throw notFound('Category not found')
}

const completedAtFor = (status) => (status === 'DONE' ? new Date() : null)

export const list = async (userId, filters = {}) => {
  const { date, from, to, categoryId, status } = filters

  const where = { userId, deletedAt: null }
  if (date) {
    where.startDate = { lte: date }
    where.endDate = { gte: date }
  } else if (from || to) {
    if (to) where.startDate = { lte: to }
    if (from) where.endDate = { gte: from }
  }
  if (categoryId) where.categoryId = categoryId
  if (status) where.status = status

  const activities = await prisma.activity.findMany({
    where,
    orderBy: [{ startDate: 'asc' }, { priority: 'desc' }, { createdAt: 'asc' }],
    include: {
      category: { select: { id: true, name: true, color: true, icon: true, deletedAt: true } },
    },
  })

  return activities.map(({ category, ...activity }) => ({
    ...activity,
    category: category && !category.deletedAt
      ? { id: category.id, name: category.name, color: category.color, icon: category.icon }
      : null,
  }))
}

export const get = (userId, id) => ownedOrThrow(userId, id)

export const create = async (userId, data) => {
  await assertCategoryOwned(userId, data.categoryId)
  return prisma.activity.create({
    data: {
      ...data,
      userId,
      endDate: data.endDate ?? data.startDate,
      completedAt: completedAtFor(data.status),
    },
  })
}

export const update = async (userId, id, data) => {
  const current = await ownedOrThrow(userId, id)
  if (data.categoryId) await assertCategoryOwned(userId, data.categoryId)

  const start = data.startDate ?? current.startDate
  const end = data.endDate ?? current.endDate
  if (end < start) throw badRequest('endDate must be on or after startDate')

  const patch = 'status' in data ? { ...data, completedAt: completedAtFor(data.status) } : data
  return prisma.activity.update({ where: { id }, data: patch })
}

export const remove = async (userId, id) => {
  await ownedOrThrow(userId, id)
  await prisma.activity.update({ where: { id }, data: { deletedAt: new Date() } })
}
