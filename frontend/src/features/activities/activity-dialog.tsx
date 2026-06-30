import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { apiMessage } from '@/lib/api-client'
import { toISODate } from '@/lib/date'
import { activitySchema, type ActivityValues } from './activities.schema'
import { PRIORITY_META, STATUS_META } from './activities.constants'
import { useActivityMutations } from './activities.queries'
import { ProjectMultiSelect } from './project-multi-select'
import { ProjectDialog } from './project-dialog'
import type { Activity, Priority, ActivityStatus } from './activities.types'

interface ActivityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activity?: Activity | null
  defaultDate: string
}

export function ActivityDialog({ open, onOpenChange, activity, defaultDate }: ActivityDialogProps) {
  const { create, update } = useActivityMutations()
  const [projectDialogOpen, setProjectDialogOpen] = useState(false)
  const isEdit = !!activity

  const { register, handleSubmit, reset, control, watch, setValue, formState } =
    useForm<ActivityValues>({ resolver: zodResolver(activitySchema) })

  const priorityItems = Object.fromEntries(
    Object.entries(PRIORITY_META).map(([k, v]) => [k, v.label]),
  )
  const statusItems = Object.fromEntries(Object.entries(STATUS_META).map(([k, v]) => [k, v.label]))
  const projectIds = watch('projectIds') ?? []

  useEffect(() => {
    if (open) {
      reset({
        title: activity?.title ?? '',
        description: activity?.description ?? '',
        startDate: activity ? toISODate(activity.startDate) : defaultDate,
        endDate: activity ? toISODate(activity.endDate) : defaultDate,
        priority: activity?.priority ?? 'MEDIUM',
        status: activity?.status ?? 'PENDING',
        projectIds: activity?.projects.map((p) => p.id) ?? [],
      })
    }
  }, [open, activity, defaultDate, reset])

  const onSubmit = async (values: ActivityValues) => {
    const input = { ...values, description: values.description?.trim() || null }
    try {
      if (isEdit) await update.mutateAsync({ id: activity.id, input })
      else await create.mutateAsync(input)
      toast.success(isEdit ? 'Actividad actualizada' : 'Actividad creada')
      onOpenChange(false)
    } catch (error) {
      toast.error(apiMessage(error))
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>{isEdit ? 'Editar actividad' : 'Nueva actividad'}</DialogTitle>
              <DialogDescription>¿Qué tienes pendiente para este día?</DialogDescription>
            </DialogHeader>

            <div className="grid gap-2">
              <Label htmlFor="act-title">Título</Label>
              <Input id="act-title" placeholder="Llamada con el cliente" {...register('title')} />
              {formState.errors.title && (
                <p className="text-sm text-destructive">{formState.errors.title.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="act-desc">Notas (opcional)</Label>
              <Textarea id="act-desc" rows={2} {...register('description')} />
            </div>

            <div className="grid gap-2">
              <Label>Proyectos</Label>
              <Controller
                control={control}
                name="projectIds"
                render={({ field }) => (
                  <ProjectMultiSelect
                    value={field.value ?? []}
                    onChange={field.onChange}
                    onCreateProject={() => setProjectDialogOpen(true)}
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="act-start">Inicio</Label>
                <Input id="act-start" type="date" {...register('startDate')} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="act-end">Fin</Label>
                <Input id="act-end" type="date" {...register('endDate')} />
                {formState.errors.endDate && (
                  <p className="text-sm text-destructive">{formState.errors.endDate.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Prioridad</Label>
                <Controller
                  control={control}
                  name="priority"
                  render={({ field }) => (
                    <Select items={priorityItems} value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(PRIORITY_META) as Priority[]).map((p) => (
                          <SelectItem key={p} value={p}>
                            {PRIORITY_META[p].label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <Label>Estado</Label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select items={statusItems} value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(STATUS_META) as ActivityStatus[]).map((s) => (
                          <SelectItem key={s} value={s}>
                            {STATUS_META[s].label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={formState.isSubmitting}>
                {isEdit ? 'Guardar' : 'Crear actividad'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create a project without leaving the task modal; auto-select it. */}
      <ProjectDialog
        open={projectDialogOpen}
        onOpenChange={setProjectDialogOpen}
        onCreated={(project) => setValue('projectIds', [...projectIds, project.id])}
      />
    </>
  )
}
