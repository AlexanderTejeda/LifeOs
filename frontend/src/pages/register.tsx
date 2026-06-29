import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { AuthShell } from '@/features/auth/auth-shell'
import { TextField } from '@/features/auth/text-field'
import { registerSchema, type RegisterValues } from '@/features/auth/auth.schema'
import { useAuth } from '@/features/auth/auth-context'
import { apiMessage } from '@/lib/api-client'

export default function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (values: RegisterValues) => {
    try {
      await registerUser(values)
      navigate('/', { replace: true })
    } catch (error) {
      toast.error(apiMessage(error, 'No se pudo crear la cuenta'))
    }
  }

  return (
    <AuthShell
      title="Crea tu cuenta"
      description="Empieza a controlar tu vida en un solo lugar"
      footer={
        <>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            Inicia sesión
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <TextField
          id="name"
          label="Nombre"
          placeholder="Alex"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name')}
        />
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
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creando…' : 'Crear cuenta'}
        </Button>
      </form>
    </AuthShell>
  )
}
