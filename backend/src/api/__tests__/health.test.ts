import request from 'supertest';
import { app } from '../../app';

describe('Health Endpoint', () => {
  it('should return 200 OK and stable payload on /health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('should bypass all AI logic', async () => {
    const startTime = Date.now();
    await request(app).get('/health');
    const endTime = Date.now();
    // It should be extremely fast, way below AI latency
    expect(endTime - startTime).toBeLessThan(100);
  });
});
