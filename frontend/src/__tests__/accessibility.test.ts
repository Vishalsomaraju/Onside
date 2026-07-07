import { describe, it, expect } from 'vitest';
import { getContrastRatio } from '../utils/contrast';

describe('Accessibility & Visual Design Tokens', () => {
  const TOKENS = {
    pitchNight: '#0B0F0C',
    floodlight: '#F5F7F2',
    chalkLine: '#4F6555',
    onsideGreen: '#3FA34D',
    cautionAmber: '#E8A33D',
    offsideRed: '#D84D42'
  };

  describe('WCAG AA Contrast Ratios (Minimum 4.5:1 for normal text, 3.0:1 for large text/UI boundaries)', () => {
    it('should have sufficient text contrast for --floodlight on --pitch-night (Page Title, Form Labels)', () => {
      const ratio = getContrastRatio(TOKENS.floodlight, TOKENS.pitchNight);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('should have sufficient contrast for --chalk-line on --pitch-night (Dropdown borders, UI boundaries)', () => {
      const ratio = getContrastRatio(TOKENS.chalkLine, TOKENS.pitchNight);
      expect(ratio).toBeGreaterThanOrEqual(3.0);
    });

    it('should have sufficient contrast for --onside-green on --pitch-night (Focus ring, Success Badges)', () => {
      const ratio = getContrastRatio(TOKENS.onsideGreen, TOKENS.pitchNight);
      expect(ratio).toBeGreaterThanOrEqual(3.0);
    });

    it('should have sufficient contrast for --offside-red on --pitch-night at the text threshold', () => {
      const ratio = getContrastRatio(TOKENS.offsideRed, TOKENS.pitchNight);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('should have sufficient contrast for --focus-ring (onside-green) on --pitch-night', () => {
      // Focus rings require at least 3:1 against background
      const ratio = getContrastRatio(TOKENS.onsideGreen, TOKENS.pitchNight);
      expect(ratio).toBeGreaterThanOrEqual(3.0);
    });
  });
});
