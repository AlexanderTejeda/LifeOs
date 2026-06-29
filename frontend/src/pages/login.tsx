import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { AuthShell } from '@/features/auth/auth-shell'
import { TextField } from '@/features/auth/text-field'
import { loginSchema, type LoginValues } from '@/features/auth/auth.schema'
import { useAuth } from '@/features/auth/auth-context'
import { apiMessage } from '@/lib/api-client'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (values: LoginValues) => {
    try {
      await login(values)
      navigate('/', { replace: true })
    } catch (error) {
      toast.error(apiMessage(error, 'No se pudo iniciar sesión'))
    }
  }

  return (
    <AuthShell
      title="Bienvenido de vuelta"
      description="Ingresa a tu LifeOS"
      footer={
        <>
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
            Crear una
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <TextField
          id="email"
          type="email"
          label="Correo"
          placeholder="tu@correo.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <TextField
          id="password"
          type="password"
          label="Contraseña"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>
    </AuthShell>
  )
}
