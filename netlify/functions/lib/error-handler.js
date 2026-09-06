// netlify/functions/lib/error-handler.js
// Consistent error response formatting

export const errorHandler = {
  badRequest: (message) => ({
    statusCode: 400,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      error: message,
      code: 'BAD_REQUEST',
      timestamp: new Date().toISOString()
    })
  }),

  notFound: (message) => ({
    statusCode: 404,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      error: message,
      code: 'NOT_FOUND',
      timestamp: new Date().toISOString()
    })
  }),

  forbidden: (message) => ({
    statusCode: 403,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      error: message,
      code: 'FORBIDDEN',
      timestamp: new Date().toISOString()
    })
  }),

  conflict: (message) => ({
    statusCode: 409,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      error: message,
      code: 'CONFLICT',
      timestamp: new Date().toISOString()
    })
  }),

  internalError: (error) => ({
    statusCode: 500,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      detail: error?.message || 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }),

  unauthorized: (message) => ({
    statusCode: 401,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      error: message,
      code: 'UNAUTHORIZED',
      timestamp: new Date().toISOString()
    })
  })
};
