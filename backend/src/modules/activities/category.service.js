import prisma from '../../shared/db.js'
import { notFound } from '../../shared/utils/ApiError.js'

const ownedOrThrow = async (userId, id) => {
  const category = await prisma.activityCategory.findFirst({
    where: { id, userId, deletedAt: null },
  })
  if (!category) throw notFound('Category not found')
  return category
}

export const list = (userId) =>
  prisma.activityCategory.findMany({
    where: { userId, deletedAt: null },
    orderBy: { createdAt: 'asc' },
  })

export const create = (userId, data) =>
  prisma.activityCategory.create({ data: { ...data, userId } })

export const update = async (userId, id, data) => {
  await ownedOrThrow(userId, id)
  return prisma.activityCategory.update({ where: { id }, data })
}

export const remove = async (userId, id) => {
  await ownedOrThrow(userId, id)
  await prisma.activityCategory.update({ where: { id }, data: { deletedAt: new Date() } })
}
