import { Router, Request, Response, NextFunction } from 'express';
import { DirectionsRequestSchema, DirectionsResponse } from '@smart-stadiums/shared';
import { findRoute } from '@smart-stadiums/domain';
import { parseIntent } from '../services/ai/intentParser';
import { generateDirections } from '../services/ai/directionsGenerator';

export const directionsRouter = Router();

/**
 * POST /api/directions
 * Accepts: { originId, query, matchPhase, language }
 * Orchestrates: AI Intent -> Domain Pathfinding -> AI Directions
 */
directionsRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Validate Input
    const parseResult = DirectionsRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        reason: 'validation_error',
        errors: parseResult.error.issues.map((e: any) => ({ path: e.path.join('.'), message: e.message }))
      });
      return;
    }

    const { originId, query, matchPhase, language } = parseResult.data;

    // 2. AI Phase 1: Parse Intent
    const intentResult = await parseIntent(query);

    // 3. Domain Phase: Deterministic Pathfinding
    const routeResult = findRoute(originId, intentResult.destinationId, matchPhase, intentResult.accessibilityRequired);

    if (!routeResult.success) {
       // Could not find a route
       res.status(400).json({
         success: false,
         source: intentResult.source,
         directions: 'Sorry, we could not find a path to that destination from here.',
         routeResult
       } as DirectionsResponse);
       return;
    }

    // 4. AI Phase 2: Natural Language Directions
    const directionsResult = await generateDirections(routeResult.steps!, language, intentResult.accessibilityRequired);

    // If either phase fell back, mark the whole response as fallback just for transparency, or keep track of both.
    // We'll mark it as 'ai' only if BOTH succeeded.
    const overallSource = (intentResult.source === 'ai' && directionsResult.source === 'ai') ? 'ai' : 'fallback';

    res.status(200).json({
      success: true,
      source: overallSource,
      directions: directionsResult.directions,
      routeResult
    } as DirectionsResponse);
  } catch (error) {
    next(error);
  }
});
