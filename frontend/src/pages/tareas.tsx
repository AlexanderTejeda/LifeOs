import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Loader2, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { todayISO, addDays, formatDayLabel, formatFullDate } from '@/lib/date'
import { useActivities, useCategories } from '@/features/activities/activities.queries'
import { CategoryFilter } from '@/features/activities/category-filter'
import { CategoryDialog } from '@/features/activities/category-dialog'
import { ActivityDialog } from '@/features/activities/activity-dialog'
import { ActivityItem } from '@/features/activities/activity-item'
import type { Activity, Category } from '@/features/activities/activities.types'

export default function TareasPage() {
  const [date, setDate] = useState(todayISO())
  const [categoryId, setCategoryId] = useState<string | null>(null)

  const [activityDialog, setActivityDialog] = useState<{ open: boolean; activity: Activity | null }>(
    { open: false, activity: null },
  )
  const [categoryDialog, setCategoryDialog] = useState<{ open: boolean; category: Category | null }>(
    { open: false, category: null },
  )

  const { data: categories = [] } = useCategories()
  const filters = useMemo(
    () => ({ date, ...(categoryId ? { categoryId } : {}) }),
    [date, categoryId],
  )
  const { data: activities = [], isLoading } = useActivities(filters)

  const pending = activities.filter((a) => a.status !== 'DONE').length

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Tareas</h1>
        <p className="text-sm text-muted-foreground">Tu agenda del día, separada por rubro.</p>
      </header>

      {/* Date navigation */}
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

      <div className="mb-5">
        <CategoryFilter
          categories={categories}
          selectedId={categoryId}
          onSelect={setCategoryId}
          onCreate={() => setCategoryDialog({ open: true, category: null })}
          onEdit={(category) => setCategoryDialog({ open: true, category })}
        />
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : activities.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
          <ClipboardList className="size-8 text-muted-foreground/50" />
          <div>
            <p className="text-sm font-medium">Sin actividades este día</p>
            <p className="text-sm text-muted-foreground">Agrega tu primer pendiente.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setActivityDialog({ open: true, activity: null })}>
            <Plus className="size-4" />
            Nueva actividad
          </Button>
        </div>
      ) : (
        <>
          <p className="mb-2 text-xs text-muted-foreground">
            {pending} pendiente{pending === 1 ? '' : 's'} · {activities.length} en total
          </p>
          <div className="grid gap-2">
            {activities.map((activity) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                onEdit={(a) => setActivityDialog({ open: true, activity: a })}
              />
            ))}
          </div>
        </>
      )}

      <ActivityDialog
        open={activityDialog.open}
        onOpenChange={(open) => setActivityDialog((s) => ({ ...s, open }))}
        activity={activityDialog.activity}
        defaultDate={date}
      />
      <CategoryDialog
        open={categoryDialog.open}
        onOpenChange={(open) => setCategoryDialog((s) => ({ ...s, open }))}
        category={categoryDialog.category}
      />
    </div>
  )
}
