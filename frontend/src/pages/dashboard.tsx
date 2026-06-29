import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PieChart, Pie, Label, BarChart, Bar, XAxis, CartesianGrid } from 'recharts'
import { CheckCircle2, Clock, Circle, ArrowRight, ListTodo } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { useAuth } from '@/features/auth/auth-context'
import { useActivities } from '@/features/activities/activities.queries'
import { todayISO, addDays, toISODate, formatWeekday } from '@/lib/date'
import type { Activity } from '@/features/activities/activities.types'

const DONE_COLOR = '#22c55e'
const REMAINING_COLOR = '#3f3f46'

const isActiveOn = (a: Activity, day: string) =>
  toISODate(a.startDate) <= day && day <= toISODate(a.endDate)

const weekConfig = {
  completadas: { label: 'Completadas', color: DONE_COLOR },
  restantes: { label: 'Restantes', color: '#a1a1aa' },
} satisfies ChartConfig

export default function DashboardPage() {
  const { user } = useAuth()
  const today = todayISO()
  const weekEnd = addDays(today, 6)
  const { data: activities = [], isLoading } = useActivities({ from: today, to: weekEnd })

  const stats = useMemo(() => {
    const todayTasks = activities.filter((a) => isActiveOn(a, today))
    const done = todayTasks.filter((a) => a.status === 'DONE').length
    const inProgress = todayTasks.filter((a) => a.status === 'IN_PROGRESS').length
    const pending = todayTasks.filter((a) => a.status === 'PENDING').length
    const total = todayTasks.length
    const pct = total ? Math.round((done / total) * 100) : 0

    const week = Array.from({ length: 7 }, (_, i) => {
      const day = addDays(today, i)
      const dayTasks = activities.filter((a) => isActiveOn(a, day))
      const d = dayTasks.filter((a) => a.status === 'DONE').length
      return { day: formatWeekday(day), completadas: d, restantes: dayTasks.length - d }
    })

    return { done, inProgress, pending, total, pct, week }
  }, [activities, today])

  const donutData = [
    { key: 'done', label: 'Completadas', value: stats.done, fill: DONE_COLOR },
    { key: 'remaining', label: 'Restantes', value: stats.total - stats.done, fill: REMAINING_COLOR },
  ]

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Hola, {user?.name} — así va tu día.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-5">
        {/* Completion donut */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-0">
            <CardTitle className="text-base">Progreso de hoy</CardTitle>
            <CardDescription>Completadas vs. pendientes</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[200px] animate-pulse rounded-lg bg-muted/40" />
            ) : stats.total === 0 ? (
              <div className="flex h-[200px] flex-col items-center justify-center gap-2 text-center">
                <Circle className="size-7 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Sin tareas para hoy</p>
              </div>
            ) : (
              <ChartContainer
                config={weekConfig}
                className="mx-auto aspect-square max-h-[200px]"
              >
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="label" hideLabel />} />
                  <Pie data={donutData} dataKey="value" nameKey="label" innerRadius={62} strokeWidth={4}>
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                          return (
                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                              <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                                {stats.pct}%
                              </tspan>
                              <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 22} className="fill-muted-foreground text-xs">
                                {stats.done} de {stats.total}
                              </tspan>
                            </text>
                          )
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:col-span-3 md:grid-rows-3 md:grid-cols-1">
          <StatCard icon={CheckCircle2} label="Completadas" value={stats.done} tint="text-green-400" />
          <StatCard icon={Clock} label="En progreso" value={stats.inProgress} tint="text-amber-400" />
          <StatCard icon={Circle} label="Pendientes" value={stats.pending} tint="text-sky-400" />
        </div>
      </div>

      {/* Weekly workload */}
      <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Carga de los próximos 7 días</CardTitle>
          <CardDescription>Tareas activas por día, completadas vs. restantes</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={weekConfig} className="h-[200px] w-full">
            <BarChart data={stats.week} barCategoryGap={12}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} className="capitalize" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="completadas" stackId="a" fill="var(--color-completadas)" radius={[0, 0, 4, 4]} />
              <Bar dataKey="restantes" stackId="a" fill="var(--color-restantes)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Link to="/tareas" className="mt-4 block">
        <Button variant="outline" className="w-full justify-between">
          <span className="flex items-center gap-2">
            <ListTodo className="size-4" />
            Ir a mis tareas
          </span>
          <ArrowRight className="size-4" />
        </Button>
      </Link>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  tint,
}: {
  icon: typeof CheckCircle2
  label: string
  value: number
  tint: string
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 py-4">
        <div className="flex size-10 items-center justify-center rounded-lg bg-secondary">
          <Icon className={`size-5 ${tint}`} />
        </div>
        <div>
          <p className="text-2xl font-semibold leading-none">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}
