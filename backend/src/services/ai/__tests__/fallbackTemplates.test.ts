import { parseIntentFallback, generateDirectionsFallback } from '../fallbackTemplates';
import { RouteStep } from '@smart-stadiums/shared';

describe('Fallback Templates', () => {
  it('should parse english intent correctly', () => {
    expect(parseIntentFallback('wheelchair bathroom', 'en')).toEqual({ destinationId: 'restroom-north', accessibilityRequired: true });
    expect(parseIntentFallback('food', 'en')).toEqual({ destinationId: 'food-east', accessibilityRequired: false });
    expect(parseIntentFallback('gate a', 'en')).toEqual({ destinationId: 'gate-a', accessibilityRequired: false });
    expect(parseIntentFallback('random', 'en')).toEqual({ destinationId: 'block-101', accessibilityRequired: false });
  });

  it('should parse spanish intent correctly', () => {
    expect(parseIntentFallback('necesito comida', 'es')).toEqual({ destinationId: 'food-east', accessibilityRequired: false });
    expect(parseIntentFallback('dónde está el baño', 'es')).toEqual({ destinationId: 'restroom-north', accessibilityRequired: false });
    expect(parseIntentFallback('salida', 'es')).toEqual({ destinationId: 'gate-a', accessibilityRequired: false });
    expect(parseIntentFallback('silla de ruedas baño', 'es')).toEqual({ destinationId: 'restroom-north', accessibilityRequired: true });
  });

  it('should parse french intent correctly', () => {
    expect(parseIntentFallback('nourriture', 'fr')).toEqual({ destinationId: 'food-east', accessibilityRequired: false });
    expect(parseIntentFallback('toilettes', 'fr')).toEqual({ destinationId: 'restroom-north', accessibilityRequired: false });
    expect(parseIntentFallback('sortie', 'fr')).toEqual({ destinationId: 'gate-a', accessibilityRequired: false });
    expect(parseIntentFallback('ascenseur', 'fr')).toEqual({ destinationId: 'block-101', accessibilityRequired: true });
  });

  it('should fallback to english keywords even if language is es or fr', () => {
    expect(parseIntentFallback('restroom', 'es')).toEqual({ destinationId: 'restroom-north', accessibilityRequired: false });
    expect(parseIntentFallback('food', 'fr')).toEqual({ destinationId: 'food-east', accessibilityRequired: false });
    expect(parseIntentFallback('wheelchair', 'es')).toEqual({ destinationId: 'block-101', accessibilityRequired: true });
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

  it('should generate directions correctly in french', () => {
    const steps: RouteStep[] = [
      { nodeId: 'node1', label: 'Node 1', distanceToNext: 10, congestionLevel: 'low', requiresAccessibleDetour: false }
    ];
    const res = generateDirectionsFallback(steps, 'fr');
    expect(res).toContain('Veuillez suivre ces étapes :');
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
