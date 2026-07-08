import { CongestionLevel, MatchPhase } from '@smart-stadiums/shared';

type ZoneConfig = { fallback: CongestionLevel; overrides: Record<string, CongestionLevel> };
const phaseConfig: Record<MatchPhase, ZoneConfig> = {
  'pre-match': { fallback: 'low', overrides: { gate: 'high', concourse: 'medium' } },
  'in-progress': { fallback: 'low', overrides: { gate: 'low', concourse: 'low', block: 'high' } },
  'halftime': { fallback: 'medium', overrides: { concourse: 'high', food: 'high', restroom: 'high' } },
  'post-match': { fallback: 'low', overrides: { gate: 'high', concourse: 'high' } }
};

/**
 * Pure deterministic function to simulate congestion.
 * Uses a fixed mapping based on the zone and match phase.
 */
export function getCongestion(matchPhase: MatchPhase, zoneId: string): CongestionLevel {
  const config = phaseConfig[matchPhase];
  if (!config) return 'low';

  for (const [keyword, level] of Object.entries(config.overrides)) {
    if (zoneId.includes(keyword)) return level;
  }

  return config.fallback;
}

const CONGESTION_MULTIPLIERS: Record<CongestionLevel, number> = {
  low: 1.0,
  medium: 1.5,
  high: 3.0
};

/**
 * Returns a numerical multiplier for the given congestion level.
 */
export function getCongestionMultiplier(level: CongestionLevel): number {
  return CONGESTION_MULTIPLIERS[level] || 1.0;
}
