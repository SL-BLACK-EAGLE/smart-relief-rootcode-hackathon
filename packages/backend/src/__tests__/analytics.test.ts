import request from 'supertest';
import app from '../app';

describe('analytics routes', () => {
  it('requires auth', async () => {
    const res = await request(app).post('/api/analytics/track').send({ eventType: 'TEST', data: { a: 1 } });
    expect([401, 422]).toContain(res.status);
  });
});
