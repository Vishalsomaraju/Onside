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

  it('should accept valid languages (en, es, fr) and reject others', () => {
    const valid = DirectionsRequestSchema.safeParse({ originId: 'a', query: 'q', matchPhase: 'pre-match', language: 'fr' });
    expect(valid.success).toBe(true);

    const invalid = DirectionsRequestSchema.safeParse({ originId: 'a', query: 'q', matchPhase: 'pre-match', language: 'de' });
    expect(invalid.success).toBe(false);
  });

  it('should bound query length and sanitize control characters', () => {
    const longQuery = 'a'.repeat(201);
    const resultLong = DirectionsRequestSchema.safeParse({ originId: 'a', query: longQuery, matchPhase: 'pre-match', language: 'en' });
    expect(resultLong.success).toBe(false);

    const resultSanitized = DirectionsRequestSchema.safeParse({ originId: 'a', query: 'hello\x00world   test', matchPhase: 'pre-match', language: 'en' });
    expect(resultSanitized.success).toBe(true);
    if (resultSanitized.success) {
      expect(resultSanitized.data.query).toBe('helloworld test');
    }
  });
});
