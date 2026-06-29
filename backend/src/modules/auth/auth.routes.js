import { Router } from 'express'
import * as authController from './auth.controller.js'
import { validate } from '../../shared/middlewares/validate.js'
import { requireAuth } from '../../shared/middlewares/requireAuth.js'
import { authLimiter } from '../../shared/middlewares/rateLimit.js'
import { registerSchema, loginSchema } from './auth.validation.js'

const router = Router()

router.post('/register', authLimiter, validate(registerSchema), authController.register)
router.post('/login', authLimiter, validate(loginSchema), authController.login)
router.get('/me', requireAuth, authController.me)

export default router
