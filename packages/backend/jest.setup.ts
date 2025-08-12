import { execSync } from 'node:child_process';
import path from 'node:path';

// Prefer TEST_DATABASE_URL, fallback to DATABASE_URL_TEST for compatibility
const rawTestUrl = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL_TEST;

// Helper to strip wrapping quotes from env values
const stripQuotes = (v?: string) => (v ? v.replace(/^['"]|['"]$/g, '') : v);

// Build a safe test URL using a dedicated schema to avoid touching public
const buildTestUrl = (base?: string) => {
  if (!base) return undefined;
  const url = stripQuotes(base) as string;
  const hasQuery = url.includes('?');
  const separator = hasQuery ? '&' : '?';
  const schemaParam = 'schema=jest_govsvc';
  // Avoid duplicating schema param
  return url.includes('schema=') ? url : `${url}${separator}${schemaParam}`;
};

const testDbUrl = buildTestUrl(rawTestUrl);

// Use a dedicated test DB if provided; otherwise, mark integration tests to skip
if (testDbUrl) {
  process.env.DATABASE_URL = testDbUrl;
  const cwd = path.resolve(__dirname); // backend package root
  try {
    // Push schema to the dedicated test schema
    execSync('npx prisma db push --skip-generate', {
      stdio: 'inherit',
      cwd,
      env: { ...process.env, DATABASE_URL: testDbUrl },
    });
    // Seed data (government services, etc.)
    execSync('npx prisma db seed', {
      stdio: 'inherit',
      cwd,
      env: { ...process.env, DATABASE_URL: testDbUrl },
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Test DB setup failed:', e);
  }
} else {
  process.env.SKIP_INTEGRATION = '1';
}
