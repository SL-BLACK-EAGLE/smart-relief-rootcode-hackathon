// Placeholder geocoding utilities. Replace with real provider (e.g., Google, Mapbox).
export const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
  return `Approx address near (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
};
