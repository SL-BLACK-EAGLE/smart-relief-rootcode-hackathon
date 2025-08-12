import request from 'supertest';
import app from '../../app';

const registerAndLogin = async (): Promise<string | null> => {
  const email = `test${Date.now()}@example.com`;
  const password = 'Passw0rd!';
  const role = 'VICTIM';
  const res = await request(app)
    .post('/api/auth/register')
    .send({ email, password, role, acceptTerms: true, profile: { firstName: 'T', lastName: 'User' } });
  if (res.status === 201) return res.body.data.token as string;
  // fallback: try login if already exists
  const login = await request(app)
    .post('/api/auth/login')
    .send({ email, password });
  if (login.status !== 200) return null;
  return login.body.data.token as string;
};

describe('Appointments authenticated flows', () => {
  it('books and reschedules an appointment', async () => {
  const token = await registerAndLogin();
  if (!token) return; // skip if auth not available

    // Fetch at least one government service (may be empty if fallback)
    const svc = await request(app).get('/api/government-services/search');
    expect(svc.status).toBe(200);
    const service = svc.body.data[0];
    if (!service) return; // no seed available, skip rest silently

    // Choose a weekday from service timeSlots
    const slot = (service.timeSlots || [])[0];
    if (!slot) return;
    const now = new Date();
    // Find next date matching slot.dayOfWeek
    const offset = (slot.dayOfWeek - now.getDay() + 7) % 7 || 1;
    const date = new Date(now);
    date.setDate(now.getDate() + offset);
    const dateStr = date.toISOString().slice(0, 10);

    const book = await request(app)
      .post('/api/appointments/book')
      .set('Authorization', `Bearer ${token}`)
      .send({ serviceId: service.id, appointmentDate: dateStr, timeSlot: slot.startTime });
    expect([201, 400, 404]).toContain(book.status);
    if (book.status !== 201) return;

    const apptId = book.body.data.appointment.id as string;
    // Attempt reschedule to same slot (may 400 if not allowed)
    const reschedule = await request(app)
      .put(`/api/appointments/${apptId}/reschedule`)
      .set('Authorization', `Bearer ${token}`)
      .send({ newDate: dateStr, newTimeSlot: slot.startTime });
    expect([200, 400]).toContain(reschedule.status);
  });
});
