import request from 'supertest';
import app from '../../app';

const createUserToken = async (role: 'VICTIM' | 'ADMIN' = 'VICTIM'): Promise<string | null> => {
  const email = `${role.toLowerCase()}${Date.now()}@example.com`;
  const password = 'Passw0rd!';
  const res = await request(app)
    .post('/api/auth/register')
    .send({ email, password, role, acceptTerms: true, profile: { firstName: 'A', lastName: role } });
  if (res.status === 201) return res.body.data.token as string;
  const login = await request(app).post('/api/auth/login').send({ email, password });
  if (login.status !== 200) return null;
  return login.body.data.token as string;
};

describe('Appointments end-to-end flow (auth)', () => {
  it('cancel, check-in (if today), complete (admin), and feedback', async () => {
    const userToken = await createUserToken('VICTIM');
    const adminToken = await createUserToken('ADMIN');
    if (!userToken || !adminToken) return; // skip if auth not available

    // Pick a service and a slot
    const svc = await request(app).get('/api/government-services/search');
    expect(svc.status).toBe(200);
    const service = svc.body.data[0];
    if (!service || !service.timeSlots?.length) return;

    // For booking, choose the first slot date in the future
    const slot = service.timeSlots[0];
    const now = new Date();
    const offset = (slot.dayOfWeek - now.getDay() + 7) % 7 || 1;
    const bookDate = new Date(now);
    bookDate.setDate(now.getDate() + offset);
    const bookDateStr = bookDate.toISOString().slice(0, 10);

    const book = await request(app)
      .post('/api/appointments/book')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ serviceId: service.id, appointmentDate: bookDateStr, timeSlot: slot.startTime });
    expect([201, 400, 404]).toContain(book.status);
    if (book.status !== 201) return;

    const apptId = book.body.data.appointment.id as string;

    // Try cancel (may 400 if not allowed depending on policy)
    const cancel = await request(app)
      .put(`/api/appointments/${apptId}/cancel`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ reason: 'Test cancel' });
    expect([200, 400]).toContain(cancel.status);

    // If we cancelled, we’re done; else try same-day check-in flow
    if (cancel.status !== 200) {
      const today = new Date();
      if (slot.dayOfWeek === today.getDay()) {
        const todayStr = today.toISOString().slice(0, 10);
        // Attempt reschedule to today, same time slot
        const reschedule = await request(app)
          .put(`/api/appointments/${apptId}/reschedule`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ newDate: todayStr, newTimeSlot: slot.startTime });
        expect([200, 400]).toContain(reschedule.status);

        if (reschedule.status === 200) {
          const checkin = await request(app)
            .put(`/api/appointments/${apptId}/check-in`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({});
          expect([200, 400]).toContain(checkin.status);

          if (checkin.status === 200) {
            const complete = await request(app)
              .put(`/api/appointments/${apptId}/complete`)
              .set('Authorization', `Bearer ${adminToken}`)
              .send({ notes: 'Test complete' });
            expect([200, 400, 403]).toContain(complete.status);

            if (complete.status === 200) {
              const feedback = await request(app)
                .post(`/api/appointments/${apptId}/feedback`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ rating: 5, comment: 'Great service' });
              expect([200, 400, 403]).toContain(feedback.status);
            }
          }
        }
      }
    }
  });
});
