import { parseIntentFallback, generateDirectionsFallback } from '../fallbackTemplates';
import { RouteStep } from '@smart-stadiums/shared';

describe('Fallback Templates', () => {
  it('should parse intent correctly', () => {
    expect(parseIntentFallback('wheelchair bathroom')).toEqual({ destinationId: 'restroom-1', accessibilityRequired: true });
    expect(parseIntentFallback('food')).toEqual({ destinationId: 'food-1', accessibilityRequired: false });
    expect(parseIntentFallback('gate a')).toEqual({ destinationId: 'gate-a', accessibilityRequired: false });
    expect(parseIntentFallback('random')).toEqual({ destinationId: 'block-101', accessibilityRequired: false });
  });

  it('should generate directions correctly in english', () => {
    const steps: RouteStep[] = [
      { nodeId: 'node1', label: 'Node 1', distanceToNext: 10, congestionLevel: 'low', requiresAccessibleDetour: false }
    ];
    const res = generateDirectionsFallback(steps, 'en');
    expect(res).toContain('Please follow these steps:');
    expect(res).toContain('Node 1');
  });

  it('should generate directions correctly in spanish', () => {
    const steps: RouteStep[] = [
      { nodeId: 'node1', label: 'Node 1', distanceToNext: 10, congestionLevel: 'low', requiresAccessibleDetour: false }
    ];
    const res = generateDirectionsFallback(steps, 'es');
    expect(res).toContain('Siga estos pasos:');
    expect(res).toContain('Node 1');
  });

  it('matches gates and exits', () => {
    expect(parseIntentFallback('where is gate b')).toEqual({ destinationId: 'gate-b', accessibilityRequired: false });
    expect(parseIntentFallback('i need an exit')).toEqual({ destinationId: 'gate-a', accessibilityRequired: false });
  });

  it('matches block and seat', () => {
    expect(parseIntentFallback('my seat is in block 101')).toEqual({ destinationId: 'block-101', accessibilityRequired: false });
  });
});
