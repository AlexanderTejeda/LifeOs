import rateLimit from 'express-rate-limit'

const json = (req, res) =>
  res.status(429).json({ success: false, message: 'Too many requests, please try again later' })

// Generous catch-all for the whole API.
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: json,
})

// Tight limit for auth endpoints to slow down brute force / credential stuffing.
// Successful requests don't count, so legit users aren't locked out by activity.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  handler: json,
})
