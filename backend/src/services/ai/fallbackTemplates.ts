import { RouteStep } from '@smart-stadiums/shared';

import { getDestinationNodeIds } from '@smart-stadiums/domain';

/**
 * Deterministic fallback for intent parsing.
 * Matches keywords to known destinations.
 */
const ACC_KEYWORDS = [
  'wheelchair', 'accessible', 'step-free', 'no stairs', 'ramp', 'elevator',
  'silla de ruedas', 'accesible', 'sin escaleras', 'rampa', 'ascensor',
  'fauteuil roulant', 'accessible', 'sans escalier', 'rampe', 'ascenseur'
];

const FOOD_KW_EN = ['food', 'hot dog', 'beer', 'concession'];
const FOOD_KW_ES = [...FOOD_KW_EN, 'comida', 'cerveza', 'concesión'];
const FOOD_KW_FR = [...FOOD_KW_EN, 'nourriture', 'bière', 'concession'];

const RR_KW_EN = ['restroom', 'bathroom', 'toilet', 'wc'];
const RR_KW_ES = [...RR_KW_EN, 'baño', 'aseo', 'sanitario'];
const RR_KW_FR = [...RR_KW_EN, 'toilettes', 'bain'];

const EXIT_KW_EN = ['exit'];
const EXIT_KW_ES = [...EXIT_KW_EN, 'salida'];
const EXIT_KW_FR = [...EXIT_KW_EN, 'sortie'];

// eslint-disable-next-line complexity -- Fallback keyword checking inherently requires multiple branching paths
export const parseIntentFallback = (query: string, language: string = 'en'): { destinationId: string; accessibilityRequired: boolean } => {
  const q = query.toLowerCase();
  
  const accessibilityRequired = ACC_KEYWORDS.some(kw => q.includes(kw));
  
  let destinationId = 'block-101'; // Safe default

  const isEs = language === 'es';
  const isFr = language === 'fr';

  const foodKw = isEs ? FOOD_KW_ES : isFr ? FOOD_KW_FR : FOOD_KW_EN;
  const rrKw = isEs ? RR_KW_ES : isFr ? RR_KW_FR : RR_KW_EN;
  const exitKw = isEs ? EXIT_KW_ES : isFr ? EXIT_KW_FR : EXIT_KW_EN;

  if (foodKw.some(kw => q.includes(kw))) {
    destinationId = 'food-east';
  } else if (rrKw.some(kw => q.includes(kw))) {
    destinationId = 'restroom-north';
  } else if (exitKw.some(kw => q.includes(kw))) {
    destinationId = 'gate-a';
  } else {
    // Dynamic matching over valid IDs for coverage of all nodes
    for (const id of getDestinationNodeIds()) {
      if (q.includes(id.replace(/-/g, ' ').toLowerCase()) || q.includes(id.toLowerCase())) {
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
