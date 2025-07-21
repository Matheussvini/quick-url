# === Stage 1: Base - Setup Node.js and dependencies for the entire monorepo ===
FROM node:22-alpine AS base

WORKDIR /app
COPY package*.json ./
COPY apps/users/package.json ./apps/users/package.json
RUN npm ci

# === Stage 2: Build - Build da aplicação específica (users-api) ===
FROM base AS build

WORKDIR /app
COPY . .
RUN npm run build:users

# === Stage 3: Production - Aplicação pronta para rodar ===
FROM node:22-alpine AS prod

WORKDIR /app
COPY package*.json ./
COPY apps/users/package.json ./apps/users/package.json
RUN npm ci --omit=dev --ignore-scripts

COPY --from=build /app/apps/users/build ./apps/users/build
COPY --from=build /app/apps/users/prisma ./apps/users/prisma
COPY --from=build /app/apps/users/src/generated/.prisma ./apps/users/src/generated/.prisma

EXPOSE 3000
CMD ["sh", "-c", "npm run prisma:migrate:deploy:users && npm run prisma:generate:users && npm run start:users"]