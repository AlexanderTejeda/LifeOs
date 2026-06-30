import prisma from '../../shared/db.js'
import { notFound } from '../../shared/utils/ApiError.js'

// Ensures the project exists, belongs to the user, and isn't soft-deleted.
const ownedOrThrow = async (userId, id) => {
  const project = await prisma.project.findFirst({ where: { id, userId, deletedAt: null } })
  if (!project) throw notFound('Project not found')
  return project
}

export const list = (userId) =>
  prisma.project.findMany({
    where: { userId, deletedAt: null },
    orderBy: { createdAt: 'asc' },
  })

export const create = (userId, data) => prisma.project.create({ data: { ...data, userId } })

export const update = async (userId, id, data) => {
  await ownedOrThrow(userId, id)
  return prisma.project.update({ where: { id }, data })
}

// Soft delete: keep the row, mark it deleted. Reads filter it out.
export const remove = async (userId, id) => {
  await ownedOrThrow(userId, id)
  await prisma.project.update({ where: { id }, data: { deletedAt: new Date() } })
}
