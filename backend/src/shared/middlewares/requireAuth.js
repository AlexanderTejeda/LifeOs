import { verifyToken } from '../utils/jwt.js'
import { unauthorized } from '../utils/ApiError.js'

export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization ?? ''
  const [scheme, token] = header.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return next(unauthorized('Missing or malformed Authorization header'))
  }

  try {
    const payload = verifyToken(token)
    req.user = { id: payload.sub }
    next()
  } catch {
    next(unauthorized('Invalid or expired token'))
  }
}
