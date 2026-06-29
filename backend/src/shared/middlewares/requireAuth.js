import { verifyToken } from '../utils/jwt.js'
import { unauthorized } from '../utils/ApiError.js'

// Extracts and verifies a Bearer token. On success attaches { id } to req.user.
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
    // Covers expired, malformed, and tampered tokens — never leak the reason.
    next(unauthorized('Invalid or expired token'))
  }
}
