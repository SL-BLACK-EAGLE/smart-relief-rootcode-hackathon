import request from 'supertest';
import app from '../../app';

const maybeDescribe = process.env.SKIP_INTEGRATION ? describe.skip : describe;

maybeDescribe('Integration: Resources & Volunteers allocation/assignment', () => {
  let token: string;
  let aidId: string;
  let resourceId: string;
  let volunteerId: string;

  it('register user', async () => {
    const email = `resvol_${Date.now()}@test.com`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email, password: 'Password123!', acceptTerms: true });
    expect(res.status).toBe(201);
    token = res.body.data.token;
  });

  it('create aid request', async () => {
    const res = await request(app)
      .post('/api/aid-requests')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Need food',
        description: 'Emergency food supplies',
        category: 'FOOD',
        latitude: 6.9,
        longitude: 79.8,
      });
    expect(res.status).toBe(201);
    aidId = res.body.data.id;
  });

  it('create resource', async () => {
    const res = await request(app)
      .post('/api/resources')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Food Pack',
        quantity: 100,
        unit: 'packs',
        type: 'FOOD',
        latitude: 6.9,
        longitude: 79.86,
      });
    expect([200, 201]).toContain(res.status);
    resourceId = res.body.data.id;
  });

  it('allocate resource to aid request', async () => {
    const res = await request(app)
      .post(`/api/aid-requests/${aidId}/allocate-resource`)
      .set('Authorization', `Bearer ${token}`)
      .send({ resourceId, amount: 10 });
    expect([200, 201]).toContain(res.status);
  });

  it('create volunteer and assign to aid request', async () => {
    // Create a volunteer task using volunteers API
    const resCreateVol = await request(app)
      .post('/api/volunteers/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Helper One',
        skill: 'LOGISTICS',
        latitude: 6.91,
        longitude: 79.85,
      });
    expect([200, 201]).toContain(resCreateVol.status);
    volunteerId = resCreateVol.body.data.id;

    const resAssign = await request(app)
      .post(`/api/aid-requests/${aidId}/assign-volunteer`)
      .set('Authorization', `Bearer ${token}`)
      .send({ volunteerId });
    expect([200, 201]).toContain(resAssign.status);
  });
});
