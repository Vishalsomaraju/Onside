import type { DirectionsResponse, RouteStep } from '@smart-stadiums/shared';

interface RouteResultProps {
  result: DirectionsResponse | null;
  error: string | null;
  isLoading: boolean;
}

function CongestionBadge({ level }: { level: string }) {
  return (
    <span className={`congestion-indicator congestion-${level}`}>
      <span className="congestion-dot" aria-hidden="true">●</span>
      <span className="congestion-text">{level.charAt(0).toUpperCase() + level.slice(1)}</span>
    </span>
  );
}

function RouteStepsList({ steps }: { steps: RouteStep[] }) {
  if (!steps || steps.length === 0) return null;
  return (
    <div className="route-steps">
      <h4>Step-by-step Route</h4>
      <ol>
        {steps.map((step, index) => (
          <li key={`${step.nodeId}-${index}`}>
            <div className="step-header">
              <span className="step-number">{index + 1}.</span>
              <span className="step-label">{step.label}</span>
            </div>
            <div className="step-details">
              <span>{step.distanceToNext}m</span>
              <CongestionBadge level={step.congestionLevel} />
              {step.requiresAccessibleDetour && <span className="accessible-detour">Accessible Detour</span>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function AriaLiveAnnouncer({ result, error, isLoading }: RouteResultProps) {
  return (
    <div aria-live="polite" aria-atomic="true" className="visually-hidden">
      {isLoading && 'Fetching route...'}
      {error && `Error: ${error}`}
      {result && result.success && 'Route found.'}
      {result && !result.success && 'No route found.'}
    </div>
  );
}

export function RouteResult({ result, error, isLoading }: RouteResultProps) {
  return (
    <div className="route-result-container">
      {/* aria-live region to announce changes to screen readers */}
      <AriaLiveAnnouncer result={result} error={error} isLoading={isLoading} />

      {error && (
        <div className="error-message" role="alert">
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className={`result-card ${!result.success ? 'result-fallback' : ''}`}>
          <h3>{result.success ? 'Directions' : 'General Guidance'}</h3>
          
          <div className="directions-text">
            <p>{result.directions}</p>
            <small className={`source-badge source-${result.source}`}>
              Source: {result.source.toUpperCase()}
            </small>
          </div>

          {result.success && result.routeResult?.success && (
            <RouteStepsList steps={result.routeResult.steps} />
          )}

          {!result.success && (
            <div className="no-route-warning">
              <p>Specific turn-by-turn routing is currently unavailable for this request.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
