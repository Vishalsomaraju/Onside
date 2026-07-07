import { getCongestion, getCongestionMultiplier } from '../congestion';
import { MatchPhase } from '@smart-stadiums/shared';

describe('Congestion Simulator', () => {
  it('should return high congestion for gates during pre-match', () => {
    expect(getCongestion('pre-match', 'gate-north')).toBe('high');
  });

  describe('in-progress', () => {
    it('should be low for gate', () => {
      expect(getCongestion('in-progress', 'gate-a')).toBe('low');
    });
    
    it('should be high for block', () => {
      expect(getCongestion('in-progress', 'block-101')).toBe('high');
    });
    
    it('should be low for other zones', () => {
      expect(getCongestion('in-progress', 'unknown')).toBe('low');
    });
  });

  it('should return high congestion for restrooms and food during halftime', () => {
    expect(getCongestion('halftime', 'food-east')).toBe('high');
    expect(getCongestion('halftime', 'restroom-north')).toBe('high');
    expect(getCongestion('halftime', 'gate-north')).toBe('medium');
  });

  it('should return appropriate congestion for post-match', () => {
    expect(getCongestion('post-match', 'gate-north')).toBe('high');
    expect(getCongestion('post-match', 'concourse-east')).toBe('high');
    expect(getCongestion('post-match', 'block-101')).toBe('low');
  });

  it('should return expected multipliers', () => {
    expect(getCongestionMultiplier('low')).toBe(1.0);
    expect(getCongestionMultiplier('medium')).toBe(1.5);
    expect(getCongestionMultiplier('high')).toBe(3.0);
  });

  it('should apply multiplier 1.0 for unknown congestion level', () => {
    expect(getCongestionMultiplier('unknown' as any)).toBe(1.0);
  });
  
  it('should fallback to low for unknown match phase', () => {
    expect(getCongestion('unknown' as any, 'gate-a')).toBe('low');
  });
});
