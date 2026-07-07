import { z } from 'zod';

export const RouteRequestSchema = z.object({
  originId: z.string().min(1, 'originId is required'),
  destinationId: z.string().min(1, 'destinationId is required'),
  matchPhase: z.enum(['pre-match', 'in-progress', 'halftime', 'post-match']),
  accessibilityRequired: z.boolean(),
});

export type RouteRequest = z.infer<typeof RouteRequestSchema>;
