import { z } from 'zod';
import type { RouteResult } from './stadium';

export const DirectionsRequestSchema = z.object({
  originId: z.string().min(1, 'originId is required'),
  query: z.string()
    .min(1, 'query is required')
    .max(200, 'query is too long')
    // eslint-disable-next-line no-control-regex
    .transform(val => val.replace(/[\x00-\x1F\x7F-\x9F]/g, '').replace(/\s+/g, ' ').trim()),
  matchPhase: z.enum(['pre-match', 'in-progress', 'halftime', 'post-match']),
  language: z.enum(['en', 'es', 'fr']).default('en'),
  accessibilityRequired: z.boolean().optional(),
});

export type DirectionsRequest = z.infer<typeof DirectionsRequestSchema>;

export type DirectionsResponse = {
  success: boolean;
  source: 'ai' | 'fallback';
  directions: string;
  routeResult?: RouteResult; // Contains the raw domain route Result for frontend UI mapping
};
