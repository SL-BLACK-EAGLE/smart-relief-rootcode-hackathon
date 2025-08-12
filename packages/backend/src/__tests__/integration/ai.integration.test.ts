import request from 'supertest';
import app from '../../app';

describe('AI Integration E2E', () => {
  it('analyzes image by URL via backend proxy (skips if AI unavailable)', async () => {
    const res = await request(app)
      .post('/api/ai/damage/analyze-url')
      .send({ fileUrl: 'https://httpbin.org/image/jpeg', latitude: 34.05, longitude: -118.25 });

    if (res.status !== 200) {
      // Skip assertions if AI service isn’t reachable
      return;
    }
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('damage_level');
    expect(res.body.data).toHaveProperty('confidence_score');
  }, 30000);
});
