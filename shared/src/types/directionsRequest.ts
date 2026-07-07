import { z } from 'zod';

export const DirectionsRequestSchema = z.object({
  originId: z.string().min(1, 'originId is required'),
  query: z.string().min(1, 'query is required'),
  matchPhase: z.enum(['pre-match', 'in-progress', 'halftime', 'post-match']),
  language: z.string().default('en'),
});

export type DirectionsRequest = z.infer<typeof DirectionsRequestSchema>;

export type DirectionsResponse = {
  success: boolean;
  source: 'ai' | 'fallback';
  directions: string;
  routeResult?: any; // Contains the raw domain route Result for frontend UI mapping
};
