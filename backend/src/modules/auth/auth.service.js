import bcrypt from 'bcryptjs'
import prisma from '../../shared/db.js'
import { signToken } from '../../shared/utils/jwt.js'
import { conflict, unauthorized } from '../../shared/utils/ApiError.js'

const SALT_ROUNDS = 12

const DUMMY_HASH = bcrypt.hashSync('timing-attack-mitigation', SALT_ROUNDS)

const publicUser = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  createdAt: u.createdAt,
})

export const register = async ({ name, email, password }) => {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw conflict('Email is already registered')

  const hash = await bcrypt.hash(password, SALT_ROUNDS)
  const user = await prisma.user.create({
    data: { name, email, password: hash },
  })

  const token = signToken({ sub: user.id })
  return { user: publicUser(user), token }
}

export const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } })

  const match = await bcrypt.compare(password, user?.password ?? DUMMY_HASH)
  if (!user || !match) throw unauthorized('Invalid credentials')

  const token = signToken({ sub: user.id })
  return { user: publicUser(user), token }
}

export const getById = async (id) => {
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) throw unauthorized('Invalid or expired token')
  return publicUser(user)
}
