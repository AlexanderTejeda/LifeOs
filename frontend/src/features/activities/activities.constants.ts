import type { ActivityStatus, Priority } from './activities.types'

export const PRIORITY_META: Record<Priority, { label: string; className: string }> = {
  HIGH: { label: 'Alta', className: 'bg-red-500/15 text-red-400 border-red-500/20' },
  MEDIUM: { label: 'Media', className: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  LOW: { label: 'Baja', className: 'bg-sky-500/15 text-sky-400 border-sky-500/20' },
}

export const STATUS_META: Record<ActivityStatus, { label: string }> = {
  PENDING: { label: 'Pendiente' },
  IN_PROGRESS: { label: 'En progreso' },
  DONE: { label: 'Hecho' },
}

// Preset swatches for new rubros — keeps colors consistent without a full picker.
export const CATEGORY_COLORS = [
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#ef4444',
  '#f59e0b',
  '#10b981',
  '#14b8a6',
  '#6366f1',
]
