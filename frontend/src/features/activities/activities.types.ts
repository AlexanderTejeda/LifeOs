export type ActivityStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Project {
  id: string
  name: string
  color: string | null
  icon: string | null
  isActive: boolean
  createdAt: string
}

export type ProjectRef = Pick<Project, 'id' | 'name' | 'color' | 'icon'>

export interface Activity {
  id: string
  userId: string
  title: string
  description: string | null
  startDate: string
  endDate: string
  status: ActivityStatus
  priority: Priority
  completedAt: string | null
  createdAt: string
  updatedAt: string
  projects: ProjectRef[]
}

export interface ActivityFilters {
  date?: string
  from?: string
  to?: string
  projectId?: string
  status?: ActivityStatus
}

export interface ProjectInput {
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
  projectIds?: string[]
}
