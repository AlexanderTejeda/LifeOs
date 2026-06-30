import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as activitiesApi from './activities.api'
import type { ActivityFilters, ActivityInput, ProjectInput } from './activities.types'

const keys = {
  projects: ['projects'] as const,
  activities: (filters: ActivityFilters) => ['activities', filters] as const,
}

// ─── Projects ───
export function useProjects() {
  return useQuery({ queryKey: keys.projects, queryFn: activitiesApi.listProjects })
}

export function useProjectMutations() {
  const qc = useQueryClient()
  const invalidate = () => qc.invalidateQueries({ queryKey: keys.projects })

  const create = useMutation({ mutationFn: activitiesApi.createProject, onSuccess: invalidate })
  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<ProjectInput> }) =>
      activitiesApi.updateProject(id, input),
    onSuccess: invalidate,
  })
  const remove = useMutation({
    mutationFn: activitiesApi.deleteProject,
    // Deleting a project also drops it from its activities, so refresh both.
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
