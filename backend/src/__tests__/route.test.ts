import request from 'supertest';
import { app } from '../app';
import { findRoute } from '@smart-stadiums/domain';

jest.mock('@smart-stadiums/domain', () => {
  const original = jest.requireActual('@smart-stadiums/domain');
  return {
    ...original,
    findRoute: jest.fn(original.findRoute)
  };
});

describe('POST /api/route', () => {
  it('should return 400 for missing required fields', async () => {
    const res = await request(app)
      .post('/api/route')
      .send({
        originId: 'gate-a'
        // missing destinationId, matchPhase, accessibilityRequired
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.reason).toBe('validation_error');
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('should return 400 for invalid matchPhase', async () => {
    const res = await request(app)
      .post('/api/route')
      .send({
        originId: 'gate-a',
        destinationId: 'block-101',
        matchPhase: 'invalid-phase',
        accessibilityRequired: false
      });

    expect(res.status).toBe(400);
    expect(res.body.reason).toBe('validation_error');
  });

  it('should return a valid route for a correct request', async () => {
    const res = await request(app)
      .post('/api/route')
      .send({
        originId: 'gate-a',
        destinationId: 'block-101',
        matchPhase: 'pre-match',
        accessibilityRequired: false
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.steps).toBeDefined();
    expect(res.body.totalDistance).toBeDefined();
    expect(res.body.steps.length).toBeGreaterThan(0);
  });

  it('should return 400 with invalid_nodes for unknown nodes', async () => {
    const res = await request(app)
      .post('/api/route')
      .send({
        originId: 'unknown-a',
        destinationId: 'block-101',
        matchPhase: 'pre-match',
        accessibilityRequired: false
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.reason).toBe('invalid_nodes');
  });

  it('should trigger global error handler if domain logic throws unexpectedly', async () => {
    (findRoute as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Unexpected domain crash');
    });

    const res = await request(app).post('/api/route').send({
      originId: 'gate-a',
      destinationId: 'block-101',
      matchPhase: 'pre-match',
      accessibilityRequired: false
    });

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.reason).toBe('internal_server_error');
  });

  it('should enforce rate limiting', async () => {
    // We send 31 requests rapidly. The limit is 30.
    const reqs = Array.from({ length: 31 }).map(() =>
      request(app).post('/api/route').send({
        originId: 'gate-a',
        destinationId: 'block-101',
        matchPhase: 'pre-match',
        accessibilityRequired: false
      })
    );

    const responses = await Promise.all(reqs);
    
    const rateLimitedResponses = responses.filter(r => r.status === 429);
    expect(rateLimitedResponses.length).toBeGreaterThan(0);
    expect(rateLimitedResponses[0].body.reason).toBe('rate_limit_exceeded');
  });
});
