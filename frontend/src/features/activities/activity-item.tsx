import { MoreHorizontal, Pencil, Trash2, CalendarRange } from 'lucide-react'
import { toast } from 'sonner'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { apiMessage } from '@/lib/api-client'
import { toISODate, formatShort } from '@/lib/date'
import { PRIORITY_META, STATUS_META } from './activities.constants'
import { useActivityMutations } from './activities.queries'
import type { Activity } from './activities.types'

interface ActivityItemProps {
  activity: Activity
  onOpen: (activity: Activity) => void
  onEdit: (activity: Activity) => void
}

export function ActivityItem({ activity, onOpen, onEdit }: ActivityItemProps) {
  const { update, remove } = useActivityMutations()
  const isDone = activity.status === 'DONE'
  const isMultiDay = toISODate(activity.startDate) !== toISODate(activity.endDate)

  const toggle = () =>
    update.mutate({ id: activity.id, input: { status: isDone ? 'PENDING' : 'DONE' } })

  const onDelete = async () => {
    try {
      await remove.mutateAsync(activity.id)
      toast.success('Actividad eliminada')
    } catch (error) {
      toast.error(apiMessage(error))
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 transition-colors hover:bg-accent/40">
      <Checkbox checked={isDone} onCheckedChange={toggle} className="size-5" />

      {/* Body opens the full task view */}
      <button
        type="button"
        onClick={() => onOpen(activity)}
        className="min-w-0 flex-1 text-left"
      >
        <p className={cn('truncate text-sm font-medium', isDone && 'text-muted-foreground line-through')}>
          {activity.title}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          {activity.projects.map((p) => (
            <span key={p.id} className="flex items-center gap-1.5">
              <span className="size-2 rounded-full" style={{ backgroundColor: p.color ?? '#71717a' }} />
              {p.name}
            </span>
          ))}
          {isMultiDay && (
            <span className="flex items-center gap-1">
              <CalendarRange className="size-3" />
              {formatShort(activity.startDate)} – {formatShort(activity.endDate)}
            </span>
          )}
          {activity.status === 'IN_PROGRESS' && <span>· {STATUS_META.IN_PROGRESS.label}</span>}
        </div>
      </button>

      <Badge variant="outline" className={PRIORITY_META[activity.priority].className}>
        {PRIORITY_META[activity.priority].label}
      </Badge>

      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(activity)}>
            <Pencil className="size-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={onDelete}>
            <Trash2 className="size-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
