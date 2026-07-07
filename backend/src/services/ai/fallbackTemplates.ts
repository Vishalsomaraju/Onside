import { RouteStep } from '@smart-stadiums/shared';

/**
 * Deterministic fallback for intent parsing.
 * Matches keywords to known destinations.
 */
export const parseIntentFallback = (query: string): { destinationId: string; accessibilityRequired: boolean } => {
  const q = query.toLowerCase();
  
  const accessibilityRequired = q.includes('wheelchair') || q.includes('accessible') || q.includes('step-free') || q.includes('no stairs') || q.includes('ramp') || q.includes('elevator');
  
  let destinationId = 'block-101'; // Safe default
  if (q.includes('food') || q.includes('hot dog') || q.includes('beer') || q.includes('concession')) {
    destinationId = 'food-1';
  } else if (q.includes('restroom') || q.includes('bathroom') || q.includes('toilet') || q.includes('wc')) {
    destinationId = 'restroom-1';
  } else if (q.includes('gate a')) {
    destinationId = 'gate-a';
  } else if (q.includes('gate b')) {
    destinationId = 'gate-b';
  } else if (q.includes('block 101') || q.includes('seat')) {
    destinationId = 'block-101';
  } else if (q.includes('exit')) {
    destinationId = 'gate-a';
  }

  return { destinationId, accessibilityRequired };
};

/**
 * Deterministic fallback for generating directions.
 */
export const generateDirectionsFallback = (steps: RouteStep[], language: string): string => {
  const isEs = language.toLowerCase().startsWith('es');
  
  if (isEs) {
    return `Siga estos pasos:\n` + steps.map((s, i) => `${i + 1}. Vaya a ${s.label} (${s.distanceToNext}m). Congestión: ${s.congestionLevel}`).join('\n');
  }

  return `Please follow these steps:\n` + steps.map((s, i) => `${i + 1}. Head to ${s.label} (${s.distanceToNext}m). Congestion is ${s.congestionLevel}.`).join('\n');
};
