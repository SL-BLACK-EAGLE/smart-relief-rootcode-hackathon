#!/usr/bin/env sh
set -e

echo "[prod-entry] Running prisma migrate deploy..."
if npx prisma migrate deploy; then
  echo "[prod-entry] migrate deploy succeeded"
else
  EXIT_CODE=$?
  echo "[prod-entry] migrate deploy failed with code $EXIT_CODE (likely P3005 if schema already exists). Falling back to db push to sync schema without migration history."
  if npx prisma db push --accept-data-loss; then
    echo "[prod-entry] db push fallback succeeded"
  else
    echo "[prod-entry] db push fallback failed; exiting"
    exit 1
  fi
fi

if [ "$SEED_ON_START" = "true" ]; then
  echo "[prod-entry] Seeding database..."
  npm run db:seed || echo "[prod-entry] Seed failed (continuing)"
fi

echo "[prod-entry] Starting application..."
exec node dist/index.js
