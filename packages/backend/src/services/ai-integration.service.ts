import { env } from '../config/env';
const AI_BASE_URL = env.AI_BASE_URL;

export class AIIntegrationService {
  async assessDamageFromUrl(fileUrl: string, latitude?: number, longitude?: number) {
    const res = await fetch(`${AI_BASE_URL}/damage/analyze-by-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileUrl, latitude, longitude }),
    });
    if (!res.ok) throw new Error(`AI service error: ${res.status}`);
    return res.json();
  }
  async assessDamage(fileUrl: string, latitude?: number, longitude?: number) {
  const res = await fetch(`${AI_BASE_URL}/damage/analyze-by-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileUrl, latitude, longitude }),
    });
    if (!res.ok) throw new Error(`AI service error: ${res.status}`);
    return res.json();
  }

  async calculatePriority(assessmentId: number) {
    const res = await fetch(`${AI_BASE_URL}/priority/calculate/${assessmentId}`, { method: 'POST' });
    if (!res.ok) throw new Error(`AI service error: ${res.status}`);
    return res.json();
  }
}

export const aiIntegrationService = new AIIntegrationService();
