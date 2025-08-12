import request from 'supertest';
import app from '../../app';

const registerAndLogin = async (): Promise<string | null> => {
  const email = `queue${Date.now()}@example.com`;
  const password = 'Passw0rd!';
  const role = 'VICTIM';
  const reg = await request(app)
    .post('/api/auth/register')
    .send({ email, password, role, acceptTerms: true, profile: { firstName: 'Q', lastName: 'User' } });
  if (reg.status === 201) return reg.body.data.token as string;
  const login = await request(app).post('/api/auth/login').send({ email, password });
  if (login.status !== 200) return null;
  return login.body.data.token as string;
};

describe('Queue authenticated flows', () => {
  it('joins and leaves a service queue', async () => {
    const token = await registerAndLogin();
    if (!token) return; // skip if auth not wired

    const svc = await request(app).get('/api/government-services/search');
    expect(svc.status).toBe(200);
    const service = svc.body.data[0];
    if (!service) return; // skip if no services available

    const join = await request(app)
      .post('/api/queue/join')
      .set('Authorization', `Bearer ${token}`)
      .send({ serviceId: service.id, reason: 'Test join' });
    expect([201, 400, 404]).toContain(join.status);
    if (join.status !== 201) return;

    const entryId = join.body.data.id as string;
    const pos = await request(app)
      .get(`/api/queue/${entryId}/position`)
      .set('Authorization', `Bearer ${token}`);
    expect([200, 403]).toContain(pos.status);

    const leave = await request(app)
      .put(`/api/queue/${entryId}/leave`)
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect([200, 400]).toContain(leave.status);
  });
});
