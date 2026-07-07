import { useState } from 'react';
import { DirectionsRequest, DirectionsResponse } from '@smart-stadiums/shared';

export function useRoute() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DirectionsResponse | null>(null);

  const fetchRoute = async (request: DirectionsRequest) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/directions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.directions) {
          // A "no route found" with a fallback directions message is still a 400 status from the API.
          // But it has directions!
          setResult(errorData);
          return;
        }
        throw new Error(errorData.reason || 'Failed to fetch directions');
      }

      const data: DirectionsResponse = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, result, fetchRoute };
}
