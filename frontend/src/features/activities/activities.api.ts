import { api } from '@/lib/api-client'
import type {
  Activity,
  ActivityFilters,
  ActivityInput,
  Project,
  ProjectInput,
} from './activities.types'

// ─── Projects ───
export const listProjects = async () => {
  const { data } = await api.get<{ data: Project[] }>('/activities/projects')
  return data.data
}

export const createProject = async (input: ProjectInput) => {
  const { data } = await api.post<{ data: Project }>('/activities/projects', input)
  return data.data
}

export const updateProject = async (id: string, input: Partial<ProjectInput>) => {
  const { data } = await api.patch<{ data: Project }>(`/activities/projects/${id}`, input)
  return data.data
}

export const deleteProject = (id: string) => api.delete(`/activities/projects/${id}`)

// ─── Activities ───
export const listActivities = async (filters: ActivityFilters = {}) => {
  const { data } = await api.get<{ data: Activity[] }>('/activities', { params: filters })
  return data.data
}

export const getActivity = async (id: string) => {
  const { data } = await api.get<{ data: Activity }>(`/activities/${id}`)
  return data.data
}

export const createActivity = async (input: ActivityInput) => {
  const { data } = await api.post<{ data: Activity }>('/activities', input)
  return data.data
}

export const updateActivity = async (id: string, input: Partial<ActivityInput>) => {
  const { data } = await api.patch<{ data: Activity }>(`/activities/${id}`, input)
  return data.data
}

export const deleteActivity = (id: string) => api.delete(`/activities/${id}`)
