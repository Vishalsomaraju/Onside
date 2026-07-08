import { RouteStep } from '@smart-stadiums/shared';

import { getDestinationNodeIds } from '@smart-stadiums/domain';

/**
 * Deterministic fallback for intent parsing.
 * Matches keywords to known destinations.
 */
export const parseIntentFallback = (query: string): { destinationId: string; accessibilityRequired: boolean } => {
  const q = query.toLowerCase();
  
  const accessibilityRequired = q.includes('wheelchair') || q.includes('accessible') || q.includes('step-free') || q.includes('no stairs') || q.includes('ramp') || q.includes('elevator');
  
  const validIds = getDestinationNodeIds();
  let destinationId = 'block-101'; // Safe default

  // Domain-specific keyword convenience overrides
  if (q.includes('food') || q.includes('hot dog') || q.includes('beer') || q.includes('concession')) {
    destinationId = 'food-east';
  } else if (q.includes('restroom') || q.includes('bathroom') || q.includes('toilet') || q.includes('wc')) {
    destinationId = 'restroom-north';
  } else if (q.includes('exit')) {
    destinationId = 'gate-a';
  } else {
    // Dynamic matching over valid IDs for coverage of all nodes
    for (const id of validIds) {
      const idSpaced = id.replace(/-/g, ' ').toLowerCase();
      const idRaw = id.toLowerCase();
      if (q.includes(idSpaced) || q.includes(idRaw)) {
        destinationId = id;
        break;
      }
    }
  }

  return { destinationId, accessibilityRequired };
};

/**
 * Deterministic fallback for generating directions.
 */
export const generateDirectionsFallback = (steps: RouteStep[], language: string): string => {
  const lang = language.toLowerCase();
  const isEs = lang.startsWith('es');
  const isFr = lang.startsWith('fr');
  
  if (isEs) {
    return `Siga estos pasos:\n` + steps.map((s, i) => `${i + 1}. Vaya a ${s.label} (${s.distanceToNext}m). Congestión: ${s.congestionLevel}`).join('\n');
  }

  if (isFr) {
    return `Veuillez suivre ces étapes :\n` + steps.map((s, i) => `${i + 1}. Allez à ${s.label} (${s.distanceToNext}m). Congestion : ${s.congestionLevel}`).join('\n');
  }

  return `Please follow these steps:\n` + steps.map((s, i) => `${i + 1}. Head to ${s.label} (${s.distanceToNext}m). Congestion is ${s.congestionLevel}.`).join('\n');
};
