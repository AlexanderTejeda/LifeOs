// All helpers operate on plain YYYY-MM-DD strings (UTC noon) to dodge the
// timezone-shift bugs that come from `new Date('2026-06-29')` in local time.

export const todayISO = () => {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}

export const toISODate = (value: string) => value.slice(0, 10)

export const addDays = (iso: string, days: number) => {
  const date = new Date(`${iso}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

const fmt = new Intl.DateTimeFormat('es', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
})

export const formatDayLabel = (iso: string) => {
  const today = todayISO()
  if (iso === today) return 'Hoy'
  if (iso === addDays(today, 1)) return 'Mañana'
  if (iso === addDays(today, -1)) return 'Ayer'
  return fmt.format(new Date(`${iso}T12:00:00Z`))
}

export const formatFullDate = (iso: string) =>
  fmt.format(new Date(`${toISODate(iso)}T12:00:00Z`))

const shortFmt = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short', timeZone: 'UTC' })

export const formatShort = (iso: string) =>
  shortFmt.format(new Date(`${toISODate(iso)}T12:00:00Z`))

const weekdayFmt = new Intl.DateTimeFormat('es', { weekday: 'short', timeZone: 'UTC' })

export const formatWeekday = (iso: string) =>
  weekdayFmt.format(new Date(`${toISODate(iso)}T12:00:00Z`)).replace('.', '')
