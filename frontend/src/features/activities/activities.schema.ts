import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().trim().min(1, 'Requerido').max(60),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Color inválido'),
})

const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida')

export const activitySchema = z
  .object({
    title: z.string().trim().min(1, 'Requerido').max(200),
    description: z.string().trim().max(2000).optional(),
    startDate: dateStr,
    endDate: dateStr,
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'DONE']),
    categoryId: z.string().optional(),
  })
  .refine((d) => d.endDate >= d.startDate, {
    message: 'El fin debe ser igual o posterior al inicio',
    path: ['endDate'],
  })

export type CategoryValues = z.infer<typeof categorySchema>
export type ActivityValues = z.infer<typeof activitySchema>
