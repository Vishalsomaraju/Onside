import { checkSafety } from '../safetyCheck';

describe('Safety Check Service', () => {
  it('allows normal queries', () => {
    expect(checkSafety('where is the restroom', 'en').isSafe).toBe(true);
    expect(checkSafety('i want a hot dog', 'es').isSafe).toBe(true);
    expect(checkSafety('gate a', 'fr').isSafe).toBe(true);
  });

  it('declines english emergency queries', () => {
    const res = checkSafety('i am having a heart attack', 'en');
    expect(res.isSafe).toBe(false);
    expect(res.declineMessage).toContain('staff or security');
  });

  it('declines spanish emergency queries', () => {
    const res = checkSafety('hay un incendio', 'es');
    expect(res.isSafe).toBe(false);
    expect(res.declineMessage).toContain('personal del estadio');
  });

  it('declines french emergency queries', () => {
    const res = checkSafety('c\'est une urgence', 'fr');
    expect(res.isSafe).toBe(false);
    expect(res.declineMessage).toContain('personnel du stade');
  });
});
