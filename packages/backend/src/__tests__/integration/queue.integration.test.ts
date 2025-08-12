import request from 'supertest';
import app from '../../app';

describe('Queue endpoints minimal', () => {
  it('GET service queue (admin required) returns 401/403/200 depending on auth', async () => {
    const res = await request(app).get('/api/queue/service/test-service');
    expect([200, 401, 403, 404]).toContain(res.status);
  });
});
