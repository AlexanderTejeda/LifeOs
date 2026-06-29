import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as activitiesApi from './activities.api'
import type { ActivityFilters, ActivityInput, CategoryInput } from './activities.types'

const keys = {
  categories: ['categories'] as const,
  activities: (filters: ActivityFilters) => ['activities', filters] as const,
}

// ─── Categories ───
export function useCategories() {
  return useQuery({ queryKey: keys.categories, queryFn: activitiesApi.listCategories })
}

export function useCategoryMutations() {
  const qc = useQueryClient()
  const invalidate = () => qc.invalidateQueries({ queryKey: keys.categories })

  const create = useMutation({ mutationFn: activitiesApi.createCategory, onSuccess: invalidate })
  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<CategoryInput> }) =>
      activitiesApi.updateCategory(id, input),
    onSuccess: invalidate,
  })
  const remove = useMutation({
    mutationFn: activitiesApi.deleteCategory,
    onSuccess: () => qc.invalidateQueries(),
  })

  return { create, update, remove }
}

// ─── Activities ───
export function useActivities(filters: ActivityFilters) {
  return useQuery({
    queryKey: keys.activities(filters),
    queryFn: () => activitiesApi.listActivities(filters),
  })
}

export function useActivityMutations() {
  const qc = useQueryClient()
  const invalidate = () => qc.invalidateQueries({ queryKey: ['activities'] })

  const create = useMutation({ mutationFn: activitiesApi.createActivity, onSuccess: invalidate })
  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<ActivityInput> }) =>
      activitiesApi.updateActivity(id, input),
    onSuccess: invalidate,
  })
  const remove = useMutation({ mutationFn: activitiesApi.deleteActivity, onSuccess: invalidate })

  return { create, update, remove }
}
