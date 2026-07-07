import { Router, Request, Response, NextFunction } from 'express';
import { RouteRequestSchema } from '@smart-stadiums/shared';
import { findRoute } from '@smart-stadiums/domain';

export const routeRouter = Router();

/**
 * POST /api/route
 * Accepts: { originId, destinationId, matchPhase, accessibilityRequired }
 * Returns: Route steps or a no_route_found error.
 */
routeRouter.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Validate Input
    const parseResult = RouteRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        reason: 'validation_error',
        errors: parseResult.error.issues.map((e) => ({ path: e.path.join('.'), message: e.message }))
      });
      return;
    }

    const { originId, destinationId, matchPhase, accessibilityRequired } = parseResult.data;

    // 2. Call Domain Logic
    const routeResult = findRoute(originId, destinationId, matchPhase, accessibilityRequired);

    // 3. Map Response
    if (!routeResult.success) {
      // Map domain failures (like invalid_nodes or no_route_found) to 400 Bad Request
      res.status(400).json(routeResult);
      return;
    }

    res.status(200).json(routeResult);
  } catch (error) {
    next(error);
  }
});
