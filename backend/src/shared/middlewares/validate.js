// Runs a Zod schema against req.body. On success, replaces body with the
// parsed (and normalized) data. On failure, responds 400 with field errors.
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body)

  if (!result.success) {
    const errors = result.error.issues.map((i) => ({
      field: i.path.join('.'),
      message: i.message,
    }))
    return res.status(400).json({ success: false, message: 'Validation failed', errors })
  }

  req.body = result.data
  next()
}
