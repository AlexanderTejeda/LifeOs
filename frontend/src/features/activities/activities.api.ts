import { api } from '@/lib/api-client'
import type {
  Activity,
  ActivityFilters,
  ActivityInput,
  Category,
  CategoryInput,
} from './activities.types'

// ─── Categories (rubros) ───
export const listCategories = async () => {
  const { data } = await api.get<{ data: Category[] }>('/activities/categories')
  return data.data
}

export const createCategory = async (input: CategoryInput) => {
  const { data } = await api.post<{ data: Category }>('/activities/categories', input)
  return data.data
}

export const updateCategory = async (id: string, input: Partial<CategoryInput>) => {
  const { data } = await api.patch<{ data: Category }>(`/activities/categories/${id}`, input)
  return data.data
}

export const deleteCategory = (id: string) => api.delete(`/activities/categories/${id}`)

// ─── Activities ───
export const listActivities = async (filters: ActivityFilters = {}) => {
  const { data } = await api.get<{ data: Activity[] }>('/activities', { params: filters })
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
