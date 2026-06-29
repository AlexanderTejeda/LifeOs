import { z } from 'zod'

const STATUS = ['PENDING', 'IN_PROGRESS', 'DONE']
const PRIORITY = ['LOW', 'MEDIUM', 'HIGH']

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Color must be a hex like #3b82f6')
const dateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD')
  .transform((s) => new Date(`${s}T00:00:00.000Z`))

// ─── Categories ───
export const createCategorySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(60),
  color: hexColor.optional(),
  icon: z.string().trim().max(40).optional(),
})

export const updateCategorySchema = createCategorySchema
  .extend({ isActive: z.boolean() })
  .partial()
  .refine((d) => Object.keys(d).length > 0, 'At least one field is required')

// ─── Activities ───
const endNotBeforeStart = (d) => !d.startDate || !d.endDate || d.endDate >= d.startDate
const rangeError = { message: 'endDate must be on or after startDate', path: ['endDate'] }

export const createActivitySchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required').max(200),
    description: z.string().trim().max(2000).nullish(),
    startDate: dateOnly,
    endDate: dateOnly.optional(),
    status: z.enum(STATUS).optional(),
    priority: z.enum(PRIORITY).optional(),
    categoryId: z.string().cuid().nullish(),
  })
  .refine(endNotBeforeStart, rangeError)

export const updateActivitySchema = z
  .object({
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().max(2000).nullable(),
    startDate: dateOnly,
    endDate: dateOnly,
    status: z.enum(STATUS),
    priority: z.enum(PRIORITY),
    categoryId: z.string().cuid().nullable(),
  })
  .partial()
  .refine((d) => Object.keys(d).length > 0, 'At least one field is required')
  .refine(endNotBeforeStart, rangeError)

export const listActivitiesSchema = z
  .object({
    date: dateOnly.optional(),
    from: dateOnly.optional(),
    to: dateOnly.optional(),
    categoryId: z.string().cuid().optional(),
    status: z.enum(STATUS).optional(),
  })
  .partial()
