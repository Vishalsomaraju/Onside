import { CongestionLevel, MatchPhase } from '@smart-stadiums/shared';

/**
 * Pure deterministic function to simulate congestion.
 * Uses a fixed mapping based on the zone and match phase.
 */
export function getCongestion(matchPhase: MatchPhase, zoneId: string): CongestionLevel {
  if (matchPhase === 'pre-match') {
    if (zoneId.includes('gate')) return 'high';
    if (zoneId.includes('concourse')) return 'medium';
    return 'low';
  }

  if (matchPhase === 'in-progress') {
    if (zoneId.includes('gate')) return 'low';
    if (zoneId.includes('concourse')) return 'low';
    // Seating blocks are full
    if (zoneId.includes('block')) return 'high';
    return 'low';
  }

  if (matchPhase === 'halftime') {
    if (zoneId.includes('concourse')) return 'high';
    if (zoneId.includes('food') || zoneId.includes('restroom')) return 'high';
    return 'medium';
  }

  if (matchPhase === 'post-match') {
    if (zoneId.includes('gate')) return 'high';
    if (zoneId.includes('concourse')) return 'high';
    return 'low';
  }

  return 'low'; // fallback
}

/**
 * Returns a numerical multiplier for the given congestion level.
 */
export function getCongestionMultiplier(level: CongestionLevel): number {
  switch (level) {
    case 'low':
      return 1.0;
    case 'medium':
      return 1.5;
    case 'high':
      return 3.0;
    default:
      return 1.0;
  }
}
