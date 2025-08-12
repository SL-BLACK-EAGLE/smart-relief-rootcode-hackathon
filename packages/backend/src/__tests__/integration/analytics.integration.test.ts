import request from 'supertest';
import app from '../../app';
import { dateBucket } from '../../utils/analytics';

const maybeDescribe = process.env.SKIP_INTEGRATION ? describe.skip : describe;

maybeDescribe('Integration: Analytics summary', () => {
  let token: string;

  it('registers user and tracks events then summarizes by day', async () => {
    const email = `analytics_${Date.now()}@test.com`;
    const register = await request(app)
      .post('/api/auth/register')
      .send({ email, password: 'Password123!', acceptTerms: true });
    expect(register.status).toBe(201);
    token = register.body.data.token;

    // Events across two UTC days
    const e1 = '2025-08-01T10:00:00.000Z';
    const e2 = '2025-08-01T12:15:00.000Z';
    const e3 = '2025-08-02T09:00:00.000Z';

    const postEvent = async (eventType: string, timestamp: string) =>
      request(app)
        .post('/api/analytics/track')
        .set('Authorization', `Bearer ${token}`)
        .send({ eventType, data: { ok: true }, timestamp });

    const r1 = await postEvent('A', e1);
    const r2 = await postEvent('A', e2);
    const r3 = await postEvent('B', e3);
    expect([201]).toContain(r1.status);
    expect([201]).toContain(r2.status);
    expect([201]).toContain(r3.status);

    const start = '2025-08-01T00:00:00.000Z';
    const end = '2025-08-03T00:00:00.000Z';
    const summary = await request(app)
      .get('/api/analytics/summary')
      .set('Authorization', `Bearer ${token}`)
      .query({ granularity: 'day', start, end });

    expect(summary.status).toBe(200);
    const body = summary.body as { granularity: string; series: Array<{ bucket: string; counts: Record<string, number> }>; };
    expect(body.granularity).toBe('day');

    // Compute buckets via the same util to avoid TZ differences
    const b1 = dateBucket(new Date(e1), 'day');
    const b2 = dateBucket(new Date(e3), 'day');

    const map = new Map(body.series.map((s: any) => [s.bucket, s.counts]));
    expect(map.get(b1)?.A).toBe(2);
    expect(map.get(b2)?.B).toBe(1);
  });
});
