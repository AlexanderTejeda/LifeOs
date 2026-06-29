import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute, PublicOnlyRoute } from '@/routes/protected-route'
import { AppLayout } from '@/components/app-layout'
import LoginPage from '@/pages/login'
import RegisterPage from '@/pages/register'
import DashboardPage from '@/pages/dashboard'
import TareasPage from '@/pages/tareas'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/tareas" element={<TareasPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
