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
import { categorySchema, type CategoryValues } from './activities.schema'
import { CATEGORY_COLORS } from './activities.constants'
import { useCategoryMutations } from './activities.queries'
import type { Category } from './activities.types'

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
}

export function CategoryDialog({ open, onOpenChange, category }: CategoryDialogProps) {
  const { create, update } = useCategoryMutations()
  const isEdit = !!category

  const { register, handleSubmit, reset, watch, setValue, formState } = useForm<CategoryValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '', color: CATEGORY_COLORS[0] },
  })
  const color = watch('color')

  // Sync form whenever the dialog opens (new vs editing an existing rubro).
  useEffect(() => {
    if (open) {
      reset({
        name: category?.name ?? '',
        color: category?.color ?? CATEGORY_COLORS[0],
      })
    }
  }, [open, category, reset])

  const onSubmit = async (values: CategoryValues) => {
    try {
      if (isEdit) await update.mutateAsync({ id: category.id, input: values })
      else await create.mutateAsync(values)
      toast.success(isEdit ? 'Rubro actualizado' : 'Rubro creado')
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
            <DialogTitle>{isEdit ? 'Editar rubro' : 'Nuevo rubro'}</DialogTitle>
            <DialogDescription>Agrupa tus actividades por cliente, marca o área.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-2">
            <Label htmlFor="cat-name">Nombre</Label>
            <Input id="cat-name" placeholder="Cliente Acme" {...register('name')} />
            {formState.errors.name && (
              <p className="text-sm text-destructive">{formState.errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_COLORS.map((c) => (
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

          <DialogFooter>
            <Button type="submit" disabled={formState.isSubmitting}>
              {isEdit ? 'Guardar' : 'Crear rubro'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
