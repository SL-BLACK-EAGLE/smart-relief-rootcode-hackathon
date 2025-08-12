import request from 'supertest';
import app from '../app';

describe('analytics summary routes', () => {
  it('requires auth', async () => {
    const res = await request(app).get('/api/analytics/summary');
    expect([401, 422]).toContain(res.status);
  });
});
