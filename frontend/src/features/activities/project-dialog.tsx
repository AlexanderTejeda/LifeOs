import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { apiMessage } from '@/lib/api-client'
import { projectSchema, type ProjectValues } from './activities.schema'
import { PROJECT_COLORS } from './activities.constants'
import { useProjectMutations } from './activities.queries'
import type { Project } from './activities.types'

interface ProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: Project | null
  // Notified with the created project so callers (e.g. the task modal) can auto-select it.
  onCreated?: (project: Project) => void
}

export function ProjectDialog({ open, onOpenChange, project, onCreated }: ProjectDialogProps) {
  const { create, update, remove } = useProjectMutations()
  const isEdit = !!project

  const { register, handleSubmit, reset, watch, setValue, formState } = useForm<ProjectValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: { name: '', color: PROJECT_COLORS[0] },
  })
  const color = watch('color')

  useEffect(() => {
    if (open) {
      reset({ name: project?.name ?? '', color: project?.color ?? PROJECT_COLORS[0] })
    }
  }, [open, project, reset])

  const onDelete = async () => {
    if (!project) return
    try {
      await remove.mutateAsync(project.id)
      toast.success('Proyecto eliminado')
      onOpenChange(false)
    } catch (error) {
      toast.error(apiMessage(error))
    }
  }

  const onSubmit = async (values: ProjectValues) => {
    try {
      if (isEdit) {
        await update.mutateAsync({ id: project.id, input: values })
      } else {
        const created = await create.mutateAsync(values)
        onCreated?.(created)
      }
      toast.success(isEdit ? 'Proyecto actualizado' : 'Proyecto creado')
      onOpenChange(false)
    } catch (error) {
      toast.error(apiMessage(error))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Editar proyecto' : 'Nuevo proyecto'}</DialogTitle>
            <DialogDescription>Agrupa tus tareas por cliente, marca o área.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-2">
            <Label htmlFor="proj-name">Nombre</Label>
            <Input id="proj-name" placeholder="Cliente Acme" {...register('name')} />
            {formState.errors.name && (
              <p className="text-sm text-destructive">{formState.errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {PROJECT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setValue('color', c, { shouldValidate: true })}
                  className={cn(
                    'size-7 rounded-full transition-transform',
                    color === c ? 'ring-2 ring-ring ring-offset-2 ring-offset-background' : 'hover:scale-110',
                  )}
                  style={{ backgroundColor: c }}
                  aria-label={c}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="sm:justify-between">
            {isEdit ? (
              <Button type="button" variant="ghost" className="text-destructive" onClick={onDelete}>
                Eliminar
              </Button>
            ) : (
              <span />
            )}
            <Button type="submit" disabled={formState.isSubmitting}>
              {isEdit ? 'Guardar' : 'Crear proyecto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
