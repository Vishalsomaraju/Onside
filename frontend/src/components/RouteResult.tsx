import { DirectionsResponse } from '@smart-stadiums/shared';

interface RouteResultProps {
  result: DirectionsResponse | null;
  error: string | null;
  isLoading: boolean;
}

export function RouteResult({ result, error, isLoading }: RouteResultProps) {
  return (
    <div className="route-result-container">
      {/* aria-live region to announce changes to screen readers */}
      <div aria-live="polite" aria-atomic="true" className="visually-hidden">
        {isLoading && 'Fetching route...'}
        {error && `Error: ${error}`}
        {result && result.success && 'Route found.'}
        {result && !result.success && 'No route found.'}
      </div>

      {error && (
        <div className="error-message" role="alert">
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="result-card">
          <h3>Directions</h3>
          
          <div className="directions-text">
            <p>{result.directions}</p>
            <small className={`source-badge source-${result.source}`}>
              Source: {result.source.toUpperCase()}
            </small>
          </div>

          {result.routeResult?.steps && result.routeResult.steps.length > 0 && (
            <div className="route-steps">
              <h4>Step-by-step Route</h4>
              <ol>
                {result.routeResult.steps.map((step, index) => (
                  <li key={`${step.nodeId}-${index}`}>
                    <span className="step-label">{step.label}</span>
                    <span className="step-details">
                      ({step.distanceToNext}m) - Congestion: {step.congestionLevel}
                      {step.requiresAccessibleDetour && ' [Accessible Detour]'}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
