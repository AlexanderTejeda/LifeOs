const formatErrors = (error) =>
  error.issues.map((i) => ({ field: i.path.join('.'), message: i.message }))

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body)

  if (!result.success) {
    return res
      .status(400)
      .json({ success: false, message: 'Validation failed', errors: formatErrors(result.error) })
  }

  req.body = result.data
  next()
}

export const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query)

  if (!result.success) {
    return res
      .status(400)
      .json({ success: false, message: 'Validation failed', errors: formatErrors(result.error) })
  }

  req.validatedQuery = result.data
  next()
}
