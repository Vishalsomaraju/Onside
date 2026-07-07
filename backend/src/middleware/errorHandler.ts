import { Request, Response, NextFunction } from 'express';

/**
 * Global error handler middleware.
 * Ensures no stack traces or sensitive internal details leak to the client.
 */
export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  // If it's a known operational error, we could map it here.
  // For safety, we mask all unexpected errors as 500s without stack traces.
  
  const errorMessage = err instanceof Error ? err.message : err;
  console.error('[Error]', errorMessage);

  res.status(500).json({
    success: false,
    reason: 'internal_server_error',
    message: 'An unexpected error occurred. Please try again later.'
  });
};
