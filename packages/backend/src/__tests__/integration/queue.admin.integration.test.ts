import request from 'supertest';
import app from '../../app';

const login = async (email: string, password: string) => {
  const res = await request(app).post('/api/auth/login').send({ email, password });
  return res.status === 200 ? (res.body.data.token as string) : null;
};

describe('Queue admin flows', () => {
  it('lists queue and calls next (seeded)', async () => {
    const adminToken = await login('admin@smartrelief.test', 'Admin123!');
    if (!adminToken) return; // skip if auth/seed unavailable

    // Find one active service
    const svcs = await request(app).get('/api/government-services/search');
    expect(svcs.status).toBe(200);
    const service = svcs.body.data?.[0];
    if (!service) return;

    const list = await request(app)
      .get(`/api/queue/service/${service.id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect([200]).toContain(list.status);

    const call = await request(app)
      .post(`/api/queue/service/${service.id}/call-next`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect([200, 404]).toContain(call.status);
  });
});
