import { haversineKm, bboxFromCenter } from '../utils/geo';

describe('geo utils', () => {
  it('haversineKm returns ~0 for same point', () => {
    expect(haversineKm(0, 0, 0, 0)).toBeCloseTo(0, 6);
  });

  it('haversineKm returns ~111km for 1 deg lat', () => {
    expect(haversineKm(0, 0, 1, 0)).toBeGreaterThan(110);
    expect(haversineKm(0, 0, 1, 0)).toBeLessThan(112);
  });

  it('bboxFromCenter spans roughly radius on each axis', () => {
    const { minLat, maxLat, minLon, maxLon } = bboxFromCenter(0, 0, 10);
    expect(maxLat - minLat).toBeCloseTo((10 / 111) * 2, 2);
    expect(maxLon - minLon).toBeCloseTo((10 / 111) * 2, 2);
  });
});
