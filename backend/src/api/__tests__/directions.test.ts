import request from 'supertest';
import { app } from '../../app';

// Mock the AI services so we don't actually hit the network in integration tests
import { parseIntent } from '../../services/ai/intentParser';
import { generateDirections } from '../../services/ai/directionsGenerator';

jest.mock('../../services/ai/intentParser', () => ({
  parseIntent: jest.fn().mockResolvedValue({ destinationId: 'block-101', accessibilityRequired: false, source: 'ai' })
}));

jest.mock('../../services/ai/directionsGenerator', () => ({
  generateDirections: jest.fn().mockResolvedValue({ directions: 'AI Directions', source: 'ai' })
}));

describe('POST /api/directions', () => {
  it('should return 400 for missing fields', async () => {
    const res = await request(app).post('/api/directions').send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 200 and directions for valid input', async () => {
    const res = await request(app).post('/api/directions').send({
      originId: 'gate-a',
      query: 'my seat',
      matchPhase: 'pre-match',
      language: 'en'
    });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.source).toBe('ai');
    expect(res.body.directions).toBe('AI Directions');
  });

  it('should fall back if intentParser fails', async () => {
    (parseIntent as jest.Mock).mockResolvedValue({
      destinationId: 'food-east',
      accessibilityRequired: false,
      source: 'fallback'
    });
    
    (generateDirections as jest.Mock).mockResolvedValue({
      directions: 'Turn right.',
      source: 'ai'
    });

    const res = await request(app).post('/api/directions').send({
      originId: 'gate-a',
      query: 'hungry',
      matchPhase: 'pre-match'
    });

    expect(res.status).toBe(200);
    expect(res.body.source).toBe('fallback');
  });

  it('should fall back if directionsGenerator fails', async () => {
    (parseIntent as jest.Mock).mockResolvedValue({
      destinationId: 'food-east',
      accessibilityRequired: false,
      source: 'ai'
    });
    
    (generateDirections as jest.Mock).mockResolvedValue({
      directions: 'Fallback directions',
      source: 'fallback'
    });

    const res = await request(app).post('/api/directions').send({
      originId: 'gate-a',
      query: 'hungry',
      matchPhase: 'pre-match'
    });

    expect(res.status).toBe(200);
    expect(res.body.source).toBe('fallback');
  });

  it('should return 400 if route is not found (e.g. invalid origin)', async () => {
    const res = await request(app).post('/api/directions').send({
      originId: 'invalid-origin',
      query: 'my seat',
      matchPhase: 'pre-match',
      language: 'en'
    });
    
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should pass error to next if an unhandled exception occurs', async () => {
    // Force a mock to throw an error bypassing the safe catch
    (parseIntent as jest.Mock).mockImplementationOnce(() => { throw new Error('Catastrophic failure'); });
    
    const res = await request(app).post('/api/directions').send({
      originId: 'gate-a',
      query: 'my seat',
      matchPhase: 'pre-match',
      language: 'en'
    });
    
    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.reason).toBe('internal_server_error');
  });
});
