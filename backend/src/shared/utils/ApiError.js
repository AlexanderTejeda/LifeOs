// Operational error with an HTTP status. The global errorHandler reads `status`.
export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
    this.name = 'ApiError'
  }
}

export const badRequest = (msg) => new ApiError(400, msg)
export const unauthorized = (msg = 'Unauthorized') => new ApiError(401, msg)
export const conflict = (msg) => new ApiError(409, msg)
