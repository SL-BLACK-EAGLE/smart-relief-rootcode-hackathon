# SmartRelief Backend

## Run modes

- Local dev
  1. Start DB + cache:
     - docker-compose up -d postgres redis
  2. Create `packages/backend/.env.local` (example):
     - PORT=3000
     - NODE_ENV=development
     - DATABASE_URL=postgresql://smartrelief:password@localhost:5432/smartrelief_dev
     - JWT_SECRET=0123456789abcdef0123456789abcdef01234567
     - CORS_ORIGIN=*
     - AI_BASE_URL=http://localhost:8000/api/v1
     - SOCKET_AUTH_REQUIRED=false
  3. Build shared: npm run build --workspace=packages/shared
  4. Start backend: npm run dev --workspace=packages/backend
  5. Health: GET http://localhost:3000/health

- Docker Compose
  1. docker-compose up -d postgres redis
  2. docker-compose build backend && docker-compose up -d backend
  3. Health: GET http://localhost:3000/health

## Key endpoints

- Auth: POST /api/auth/register, /api/auth/login
- Users: GET /api/users/me, PATCH /api/users/me
- Aid Requests: CRUD + POST /api/aid-requests/:id/analyze
- Resources: POST /api/resources, POST /api/aid-requests/:id/allocate-resource
- Volunteers: POST /api/volunteers/tasks, POST /api/aid-requests/:id/assign-volunteer
- Notifications: CRUD
- Analytics:
  - POST /api/analytics/track
  - GET /api/analytics (filters: eventType, userId, start, end, page, limit)
  - GET /api/analytics/summary (granularity hour|day|week|month; optional start,end)

## Analytics summary
- When start & end are provided, empty buckets are pre-filled for smoother charting.

## Tests
- Unit: npm run test --workspace=packages/backend
- Integration: set DATABASE_URL_TEST, then tests will auto push schema and seed.
