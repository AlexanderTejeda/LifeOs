import { z } from 'zod'

// Capped at 72: bcrypt silently truncates input beyond 72 bytes.
const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be at most 72 characters')
  .regex(/[a-z]/, 'Password must contain a lowercase letter')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[0-9]/, 'Password must contain a number')

const email = z.string().trim().toLowerCase().email('Invalid email')

export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(80),
  email,
  password,
})

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
})
