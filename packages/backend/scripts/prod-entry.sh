#!/usr/bin/env sh
set -e

echo "[prod-entry] Running prisma migrate deploy..."
npx prisma migrate deploy || { echo "[prod-entry] migrate deploy failed"; exit 1; }

if [ "$SEED_ON_START" = "true" ]; then
  echo "[prod-entry] Seeding database..."
  npm run db:seed || echo "[prod-entry] Seed failed (continuing)"
fi

echo "[prod-entry] Starting application..."
exec node dist/index.js
