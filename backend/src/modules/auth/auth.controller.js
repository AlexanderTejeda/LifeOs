import * as authService from './auth.service.js'
import { ok, created } from '../../shared/utils/response.js'

// Express 5 forwards rejected promises to the error handler automatically.
export const register = async (req, res) => {
  const result = await authService.register(req.body)
  created(res, result)
}

export const login = async (req, res) => {
  const result = await authService.login(req.body)
  ok(res, result)
}

export const me = async (req, res) => {
  const user = await authService.getById(req.user.id)
  ok(res, user)
}
