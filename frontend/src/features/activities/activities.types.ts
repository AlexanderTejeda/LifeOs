export type ActivityStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Category {
  id: string
  name: string
  color: string | null
  icon: string | null
  isActive: boolean
  createdAt: string
}

export interface Activity {
  id: string
  userId: string
  categoryId: string | null
  title: string
  description: string | null
  startDate: string
  endDate: string
  status: ActivityStatus
  priority: Priority
  completedAt: string | null
  createdAt: string
  updatedAt: string
  category?: Pick<Category, 'id' | 'name' | 'color' | 'icon'> | null
}

export interface ActivityFilters {
  date?: string
  from?: string
  to?: string
  categoryId?: string
  status?: ActivityStatus
}

export interface CategoryInput {
  name: string
  color?: string
}

export interface ActivityInput {
  title: string
  description?: string | null
  startDate: string
  endDate?: string
  status?: ActivityStatus
  priority?: Priority
  categoryId?: string | null
}
