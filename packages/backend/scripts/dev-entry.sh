#!/usr/bin/env sh
set -e

echo "[dev-entry] Ensuring Prisma schema is applied..."
npx prisma db push --accept-data-loss || true

if [ "$SEED_ON_START" = "true" ]; then
	echo "[dev-entry] Seeding database..."
	npm run db:seed || true
fi

echo "[dev-entry] Starting dev server..."
npm run dev
