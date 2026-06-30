import { Pencil, Trash2, CalendarRange, Calendar, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { apiMessage } from '@/lib/api-client'
import { toISODate, formatFullDate } from '@/lib/date'
import { PRIORITY_META, STATUS_META } from './activities.constants'
import { useActivityMutations } from './activities.queries'
import type { Activity } from './activities.types'

interface ActivityDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activity: Activity | null
  onEdit: (activity: Activity) => void
}

export function ActivityDetail({ open, onOpenChange, activity, onEdit }: ActivityDetailProps) {
  const { update, remove } = useActivityMutations()
  if (!activity) return null

  const isDone = activity.status === 'DONE'
  const isMultiDay = toISODate(activity.startDate) !== toISODate(activity.endDate)

  const toggle = () =>
    update.mutate({ id: activity.id, input: { status: isDone ? 'PENDING' : 'DONE' } })

  const onDelete = async () => {
    try {
      await remove.mutateAsync(activity.id)
      toast.success('Actividad eliminada')
      onOpenChange(false)
    } catch (error) {
      toast.error(apiMessage(error))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className={cn('pr-6 text-left', isDone && 'text-muted-foreground line-through')}>
            {activity.title}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{STATUS_META[activity.status].label}</Badge>
            <Badge variant="outline" className={PRIORITY_META[activity.priority].className}>
              Prioridad {PRIORITY_META[activity.priority].label.toLowerCase()}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-sm">
            {isMultiDay ? <CalendarRange className="size-4 text-muted-foreground" /> : <Calendar className="size-4 text-muted-foreground" />}
            <span className="capitalize">
              {formatFullDate(activity.startDate)}
              {isMultiDay && <> — {formatFullDate(activity.endDate)}</>}
            </span>
          </div>

          <div className="grid gap-1.5">
            <p className="text-xs font-medium text-muted-foreground">Proyectos</p>
            {activity.projects.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin proyecto</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {activity.projects.map((p) => (
                  <span
                    key={p.id}
                    className="flex items-center gap-1.5 rounded-md bg-secondary px-2 py-1 text-xs"
                  >
                    <span className="size-2 rounded-full" style={{ backgroundColor: p.color ?? '#71717a' }} />
                    {p.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {activity.description && (
            <div className="grid gap-1.5">
              <p className="text-xs font-medium text-muted-foreground">Notas</p>
              <p className="whitespace-pre-wrap text-sm">{activity.description}</p>
            </div>
          )}

          <Separator />

          <Button variant={isDone ? 'outline' : 'default'} onClick={toggle} className="justify-start">
            <CheckCircle2 className="size-4" />
            {isDone ? 'Marcar como pendiente' : 'Marcar como completada'}
          </Button>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button type="button" variant="ghost" className="text-destructive" onClick={onDelete}>
            <Trash2 className="size-4" />
            Eliminar
          </Button>
          <Button type="button" variant="outline" onClick={() => onEdit(activity)}>
            <Pencil className="size-4" />
            Editar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
