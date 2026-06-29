import { Navigate, Outlet } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/features/auth/auth-context'

export function ProtectedRoute() {
  const { status } = useAuth()

  if (status === 'loading') {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return status === 'authenticated' ? <Outlet /> : <Navigate to="/login" replace />
}

// Keeps logged-in users away from /login and /register.
export function PublicOnlyRoute() {
  const { status } = useAuth()
  if (status === 'loading') return null
  return status === 'authenticated' ? <Navigate to="/" replace /> : <Outlet />
}
