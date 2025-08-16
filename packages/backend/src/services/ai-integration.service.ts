import { env } from '../config/env';
const AI_BASE_URL = env.AI_BASE_URL;

export class AIIntegrationService {
  private async postJson<T>(url: string, payload: any): Promise<T> {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      let body: any = undefined;
      try { body = await res.json(); } catch { try { body = await res.text(); } catch { /* ignore */ } }
      const detail = typeof body === 'string' ? body : body?.detail || body?.message || JSON.stringify(body);
      throw new Error(`AI service error ${res.status}${detail ? `: ${detail}` : ''}`);
    }
    return res.json() as Promise<T>;
  }

  async assessDamageFromUrl(fileUrl: string, latitude?: number, longitude?: number) {
    return this.postJson(`${AI_BASE_URL}/damage/analyze-by-url`, { fileUrl, latitude, longitude });
  }

  async assessDamage(fileUrl: string, latitude?: number, longitude?: number) {
    // Backward compatible alias
    return this.assessDamageFromUrl(fileUrl, latitude, longitude);
  }

  async calculatePriority(assessmentId: number) {
    const res = await fetch(`${AI_BASE_URL}/priority/calculate/${assessmentId}`, { method: 'POST' });
    if (!res.ok) {
      let body: any = undefined;
      try { body = await res.json(); } catch { try { body = await res.text(); } catch { /* ignore */ } }
      const detail = typeof body === 'string' ? body : body?.detail || body?.message || JSON.stringify(body);
      throw new Error(`AI service error ${res.status}${detail ? `: ${detail}` : ''}`);
    }
    return res.json();
  }
}

export const aiIntegrationService = new AIIntegrationService();
