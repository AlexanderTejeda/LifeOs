# LifeOS

Sistema open source de control de vida personal: finanzas, cuerpo, hábitos y salud en un solo lugar. Mide tu progreso en todos los aspectos importantes de tu vida — más allá de una plantilla de Excel.

## Módulos

- **Finanzas** — cuentas, transacciones, categorías, presupuestos y dashboard
- **Cuerpo** — peso, % de grasa, músculo y medidas corporales
- **Hábitos** — seguimiento de hábitos y actividades diarias
- **Salud** — sueño, energía, ánimo, hidratación, actividad

## Stack

- **Backend:** Node.js + Express 5 + PostgreSQL 17
- **ORM:** Prisma 7
- **Auth:** JWT + bcrypt
- **Validación:** Zod

## Desarrollo

```bash
cd backend
pnpm install
cp .env.example .env   # configura tu DATABASE_URL y JWT_SECRET
pnpm prisma:migrate
pnpm dev
```

El servidor queda en `http://localhost:3000`.

## Licencia

[MIT](LICENSE)
