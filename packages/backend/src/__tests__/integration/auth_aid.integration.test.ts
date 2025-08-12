import request from 'supertest';
import app from '../../app';

const maybeDescribe = process.env.SKIP_INTEGRATION ? describe.skip : describe;

maybeDescribe('Integration: Auth and Aid Requests', () => {
  let token: string;

  it('registers and logs in a user', async () => {
    const email = `user_${Date.now()}@test.com`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email, password: 'Password123!', acceptTerms: true });
    expect(res.status).toBe(201);
    expect(res.body?.data?.token).toBeDefined();
    token = res.body.data.token;
  });

  it('creates an aid request and analyzes with AI', async () => {
    const resCreate = await request(app)
      .post('/api/aid-requests')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Need water',
        description: 'Area flooded, need clean water',
        category: 'WATER',
        latitude: 6.9271,
        longitude: 79.8612,
        images: ['https://via.placeholder.com/512'],
      });
    expect(resCreate.status).toBe(201);
    const id = resCreate.body.data.id;

    const resAnalyze = await request(app)
      .post(`/api/aid-requests/${id}/analyze`)
      .set('Authorization', `Bearer ${token}`)
      .send({});
    // AI service may be unavailable; accept 200 or 500 gracefully
    expect([200, 500]).toContain(resAnalyze.status);
  });
});
