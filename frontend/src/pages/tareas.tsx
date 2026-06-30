import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Loader2, ClipboardList, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { todayISO, addDays, formatDayLabel, formatFullDate } from '@/lib/date'
import { useActivities, useProjects } from '@/features/activities/activities.queries'
import { ProjectFilter } from '@/features/activities/project-filter'
import { ProjectDialog } from '@/features/activities/project-dialog'
import { ActivityDialog } from '@/features/activities/activity-dialog'
import { ActivityDetail } from '@/features/activities/activity-detail'
import { ActivityItem } from '@/features/activities/activity-item'
import type { Activity, ActivityFilters, Project } from '@/features/activities/activities.types'

type View = 'agenda' | 'historial'

export default function TareasPage() {
  const [view, setView] = useState<View>('agenda')
  const [date, setDate] = useState(todayISO())
  const [projectId, setProjectId] = useState<string | null>(null)

  const [activityDialog, setActivityDialog] = useState<{ open: boolean; activity: Activity | null }>(
    { open: false, activity: null },
  )
  const [detail, setDetail] = useState<{ open: boolean; activity: Activity | null }>({
    open: false,
    activity: null,
  })
  const [projectDialog, setProjectDialog] = useState<{ open: boolean; project: Project | null }>({
    open: false,
    project: null,
  })

  const isHistory = view === 'historial'
  const { data: projects = [] } = useProjects()

  const filters = useMemo<ActivityFilters>(
    () =>
      isHistory
        ? { status: 'DONE', ...(projectId ? { projectId } : {}) }
        : { date, ...(projectId ? { projectId } : {}) },
    [isHistory, date, projectId],
  )
  const { data: activities = [], isLoading } = useActivities(filters)

  // History: most recently completed first.
  const items = useMemo(
    () =>
      isHistory
        ? [...activities].sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''))
        : activities,
    [isHistory, activities],
  )

  const pending = activities.filter((a) => a.status !== 'DONE').length

  const openEdit = (activity: Activity) => {
    setDetail((s) => ({ ...s, open: false }))
    setActivityDialog({ open: true, activity })
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight">Tareas</h1>
        <p className="text-sm text-muted-foreground">Tu agenda del día, separada por proyecto.</p>
      </header>

      {/* View toggle */}
      <div className="mb-5 inline-flex rounded-lg border p-0.5">
        {(['agenda', 'historial'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              view === v ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {v === 'agenda' ? 'Agenda' : 'Completadas'}
          </button>
        ))}
      </div>

      {/* Date navigation (agenda only) */}
      {!isHistory && (
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="shrink-0" onClick={() => setDate(addDays(date, -1))}>
              <ChevronLeft className="size-4" />
            </Button>
            <div className="flex-1 text-center sm:min-w-44 sm:flex-none">
              <p className="text-sm font-semibold capitalize">{formatDayLabel(date)}</p>
              <p className="text-xs capitalize text-muted-foreground">{formatFullDate(date)}</p>
            </div>
            <Button variant="outline" size="icon" className="shrink-0" onClick={() => setDate(addDays(date, 1))}>
              <ChevronRight className="size-4" />
            </Button>
            <Button variant="ghost" size="sm" className="shrink-0" onClick={() => setDate(todayISO())}>
              Hoy
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={date}
              onChange={(e) => e.target.value && setDate(e.target.value)}
              className="flex-1 sm:w-auto sm:flex-none"
            />
            <Button className="shrink-0" onClick={() => setActivityDialog({ open: true, activity: null })}>
              <Plus className="size-4" />
              Nueva
            </Button>
          </div>
        </div>
      )}

      <div className="mb-5">
        <ProjectFilter
          projects={projects}
          selectedId={projectId}
          onSelect={setProjectId}
          onCreate={() => setProjectDialog({ open: true, project: null })}
          onEdit={(project) => setProjectDialog({ open: true, project })}
        />
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
          {isHistory ? (
            <>
              <CheckCircle2 className="size-8 text-muted-foreground/50" />
              <div>
                <p className="text-sm font-medium">Sin tareas completadas</p>
                <p className="text-sm text-muted-foreground">Lo que marques como hecho aparecerá aquí.</p>
              </div>
            </>
          ) : (
            <>
              <ClipboardList className="size-8 text-muted-foreground/50" />
              <div>
                <p className="text-sm font-medium">Sin actividades este día</p>
                <p className="text-sm text-muted-foreground">Agrega tu primer pendiente.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setActivityDialog({ open: true, activity: null })}>
                <Plus className="size-4" />
                Nueva actividad
              </Button>
            </>
          )}
        </div>
      ) : (
        <>
          <p className="mb-2 text-xs text-muted-foreground">
            {isHistory ? (
              <>
                {items.length} completada{items.length === 1 ? '' : 's'} · desmarca para reactivar
              </>
            ) : (
              <>
                {pending} pendiente{pending === 1 ? '' : 's'} · {items.length} en total
              </>
            )}
          </p>
          <div className="grid gap-2">
            {items.map((activity) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                onOpen={(a) => setDetail({ open: true, activity: a })}
                onEdit={(a) => setActivityDialog({ open: true, activity: a })}
              />
            ))}
          </div>
        </>
      )}

      <ActivityDetail
        open={detail.open}
        onOpenChange={(open) => setDetail((s) => ({ ...s, open }))}
        activity={detail.activity}
        onEdit={openEdit}
      />
      <ActivityDialog
        open={activityDialog.open}
        onOpenChange={(open) => setActivityDialog((s) => ({ ...s, open }))}
        activity={activityDialog.activity}
        defaultDate={date}
      />
      <ProjectDialog
        open={projectDialog.open}
        onOpenChange={(open) => setProjectDialog((s) => ({ ...s, open }))}
        project={projectDialog.project}
      />
    </div>
  )
}
