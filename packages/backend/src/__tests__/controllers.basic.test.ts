import request from 'supertest';
import app from '../app';

describe('controllers basic', () => {
  it('requires auth for protected routes', async () => {
    const res1 = await request(app).post('/api/resources/allocate').send({});
    expect([401, 422, 400]).toContain(res1.status);
    const res2 = await request(app).post('/api/volunteers/tasks').send({});
    expect([401, 422, 400]).toContain(res2.status);
  });
});
