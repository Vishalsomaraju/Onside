import request from 'supertest';
import { app } from '../../app';

// Mock the AI services so we don't actually hit the network in integration tests
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
});
