export function dateBucket(d: Date, granularity: 'hour' | 'day' | 'week' | 'month') {
  const dt = new Date(d);
  if (granularity === 'hour') {
    dt.setMinutes(0, 0, 0);
  } else if (granularity === 'day') {
    dt.setHours(0, 0, 0, 0);
  } else if (granularity === 'week') {
    const day = dt.getDay(); // 0=Sun
    const diff = (day + 6) % 7; // make Monday start
    dt.setDate(dt.getDate() - diff);
    dt.setHours(0, 0, 0, 0);
  } else if (granularity === 'month') {
    dt.setDate(1);
    dt.setHours(0, 0, 0, 0);
  }
  return dt.toISOString();
}

export function nextBucketStart(d: Date, granularity: 'hour' | 'day' | 'week' | 'month') {
  const dt = new Date(dateBucket(d, granularity));
  if (granularity === 'hour') dt.setHours(dt.getHours() + 1);
  else if (granularity === 'day') dt.setDate(dt.getDate() + 1);
  else if (granularity === 'week') dt.setDate(dt.getDate() + 7);
  else if (granularity === 'month') dt.setMonth(dt.getMonth() + 1);
  return dt;
}

export function generateBucketRange(start: Date, end: Date, granularity: 'hour' | 'day' | 'week' | 'month') {
  const buckets: string[] = [];
  let cursor = new Date(dateBucket(start, granularity));
  const endAligned = new Date(dateBucket(end, granularity));
  while (cursor <= endAligned) {
    buckets.push(cursor.toISOString());
    cursor = nextBucketStart(cursor, granularity);
  }
  return buckets;
}
