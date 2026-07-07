import { getCongestion, getCongestionMultiplier } from '../congestion';
import { CongestionLevel, MatchPhase } from '@smart-stadiums/shared';

describe('Congestion Simulator', () => {
  describe('pre-match', () => {
    it('should be high for gates', () => expect(getCongestion('pre-match', 'gate-north')).toBe('high'));
    it('should be medium for concourse', () => expect(getCongestion('pre-match', 'concourse-north')).toBe('medium'));
    it('should be low for other', () => expect(getCongestion('pre-match', 'block-101')).toBe('low'));
  });

  describe('in-progress', () => {
    it('should be low for gate', () => expect(getCongestion('in-progress', 'gate-a')).toBe('low'));
    it('should be low for concourse', () => expect(getCongestion('in-progress', 'concourse-a')).toBe('low'));
    it('should be high for block', () => expect(getCongestion('in-progress', 'block-101')).toBe('high'));
    it('should be low for other', () => expect(getCongestion('in-progress', 'restroom-1')).toBe('low'));
  });

  describe('halftime', () => {
    it('should be high for concourse', () => expect(getCongestion('halftime', 'concourse-east')).toBe('high'));
    it('should be high for food/restroom', () => {
      expect(getCongestion('halftime', 'food-east')).toBe('high');
      expect(getCongestion('halftime', 'restroom-north')).toBe('high');
    });
    it('should be medium for other', () => expect(getCongestion('halftime', 'gate-north')).toBe('medium'));
  });

  describe('post-match', () => {
    it('should be high for gate', () => expect(getCongestion('post-match', 'gate-north')).toBe('high'));
    it('should be high for concourse', () => expect(getCongestion('post-match', 'concourse-east')).toBe('high'));
    it('should be low for other', () => expect(getCongestion('post-match', 'block-101')).toBe('low'));
  });

  it('should return expected multipliers', () => {
    expect(getCongestionMultiplier('low')).toBe(1.0);
    expect(getCongestionMultiplier('medium')).toBe(1.5);
    expect(getCongestionMultiplier('high')).toBe(3.0);
  });

  it('should apply multiplier 1.0 for unknown congestion level', () => {
    expect(getCongestionMultiplier('unknown' as CongestionLevel)).toBe(1.0);
  });
  
  it('should fallback to low for unknown match phase', () => {
    expect(getCongestion('unknown' as MatchPhase, 'gate-a')).toBe('low');
  });
});
