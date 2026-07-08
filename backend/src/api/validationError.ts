import { ZodError, ZodIssue } from 'zod';

/**
 * Shared helper to standardize validation error responses.
 */
export const formatValidationError = (error: ZodError<unknown>) => {
  return {
    success: false as const,
    reason: 'validation_error',
    errors: error.issues.map((e: ZodIssue) => ({ path: e.path.join('.'), message: e.message }))
  };
};
