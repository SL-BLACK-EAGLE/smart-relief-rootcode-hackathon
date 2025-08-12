# syntax=docker/dockerfile:1

ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-alpine AS base

# Workspace root
WORKDIR /workspace

# Install required system packages (openssl needed by Prisma)
RUN apk add --no-cache openssl curl

# Copy root and workspace manifests first for better layer caching
COPY package.json /workspace/package.json
COPY packages/shared/package.json /workspace/packages/shared/package.json
COPY packages/backend/package.json /workspace/packages/backend/package.json

# Install all workspace dependencies (including dev) but skip lifecycle scripts for now
RUN npm install --ignore-scripts

# Copy sources now that dependencies are installed
COPY packages/shared /workspace/packages/shared
COPY packages/backend /workspace/packages/backend

# Generate Prisma client before building TypeScript so types are available
RUN npx prisma generate --schema /workspace/packages/backend/prisma/schema.prisma

# Build packages (this will also run any package-level postinstall if defined)
RUN npm run build --workspace=packages/shared \
	&& npm run build --workspace=packages/backend

# ---------- Development ----------
FROM node:${NODE_VERSION}-alpine AS development
WORKDIR /app
RUN apk add --no-cache openssl curl
# Bring installed deps and sources for live dev
COPY --from=base /workspace/node_modules /app/node_modules
COPY --from=base /workspace/packages/backend /app
# Provide shared build at expected path for tsconfig-paths resolution
COPY --from=base /workspace/packages/shared/dist /shared/dist
# Link node_modules for module resolution from /shared
RUN ln -s /app/node_modules /shared/node_modules || true
# Also expose node_modules at filesystem root for Node's upward resolution from /shared
RUN ln -s /app/node_modules /node_modules || true
ENV NODE_ENV=development
EXPOSE 3000
COPY packages/backend/scripts/dev-entry.sh /usr/local/bin/dev-entry.sh
RUN chmod +x /usr/local/bin/dev-entry.sh
CMD ["/usr/local/bin/dev-entry.sh"]

# ---------- Production ----------
FROM node:${NODE_VERSION}-alpine AS production
WORKDIR /app
RUN apk add --no-cache openssl
# Copy production dependencies and builds
COPY --from=base /workspace/node_modules /app/node_modules
COPY --from=base /workspace/packages/backend/dist /app/dist
COPY --from=base /workspace/packages/backend/package.json /app/package.json
# Ensure the shared workspace package is available at runtime in node_modules
COPY --from=base /workspace/packages/shared /app/node_modules/@smartrelief/shared
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "run", "start"]
