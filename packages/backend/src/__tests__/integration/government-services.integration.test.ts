import request from 'supertest';
import app from '../../app';

describe('Government services endpoints', () => {
  it('search/categories return 200 with seed data', async () => {
    const s1 = await request(app).get('/api/government-services/search');
    expect(s1.status).toBe(200);
    expect(Array.isArray(s1.body.data)).toBe(true);

    const s2 = await request(app).get('/api/government-services/categories');
    expect(s2.status).toBe(200);
    expect(Array.isArray(s2.body.data)).toBe(true);
  });
});
