import { z } from 'zod';
import { RouteResult } from './stadium';

export const DirectionsRequestSchema = z.object({
  originId: z.string().min(1, 'originId is required'),
  query: z.string().min(1, 'query is required'),
  matchPhase: z.enum(['pre-match', 'in-progress', 'halftime', 'post-match']),
  language: z.string().default('en'),
  accessibilityRequired: z.boolean().optional(),
});

export type DirectionsRequest = z.infer<typeof DirectionsRequestSchema>;

export type DirectionsResponse = {
  success: boolean;
  source: 'ai' | 'fallback';
  directions: string;
  routeResult?: RouteResult; // Contains the raw domain route Result for frontend UI mapping
};
