import { DirectionsRequestSchema } from '../types/directionsRequest';

describe('DirectionsRequest Contract', () => {
  it('should validate a correct route request with expected destinations', () => {
    const validRequest = {
      originId: 'gate-a',
      query: 'restroom',
      matchPhase: 'pre-match',
      language: 'en'
    };
    
    const result = DirectionsRequestSchema.safeParse(validRequest);
    expect(result.success).toBe(true);
  });

  it('should reject invalid match phases', () => {
    const invalidRequest = {
      originId: 'gate-a',
      query: 'food',
      matchPhase: 'invalid-phase',
      language: 'en'
    };
    
    const result = DirectionsRequestSchema.safeParse(invalidRequest);
    expect(result.success).toBe(false);
  });

  it('should require originId and query', () => {
    const missingFields = {
      matchPhase: 'pre-match',
      language: 'en'
    };
    
    const result = DirectionsRequestSchema.safeParse(missingFields);
    expect(result.success).toBe(false);
  });
});
