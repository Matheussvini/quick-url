# === Stage 1: Base - Setup Node.js and dependencies for the entire monorepo ===
FROM node:22-alpine AS base

WORKDIR /app
COPY package*.json ./
COPY apps/urls/package.json ./apps/urls/package.json
RUN npm ci

# === Stage 2: Build 
FROM base AS build

WORKDIR /app
COPY . . 
RUN npm run build:urls

# === Stage 3: Production - Aplicação pronta para rodar ===
FROM node:22-alpine AS prod

WORKDIR /app 
COPY package*.json ./
COPY apps/urls/package.json ./apps/urls/package.json
RUN npm ci --omit=dev --ignore-scripts

COPY --from=build /app/apps/urls/build ./apps/urls/build
COPY --from=build /app/apps/urls/prisma ./apps/urls/prisma
COPY --from=build /app/apps/urls/src/generated/.prisma ./apps/urls/src/generated/.prisma

EXPOSE 3001
CMD ["sh", "-c", "npm run prisma:migrate:deploy:urls && npm run prisma:generate:urls && npm run start:urls"]

