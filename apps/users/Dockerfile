# === Etapa 1: deps (instala dependências de dev e prod) ===
FROM node:22-alpine AS deps

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci


# === Etapa 2: build (gera Prisma Client e build da aplicação) ===
FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build


# === Etapa 3: prod (apenas dependências de produção e app final) ===
FROM node:22-alpine AS prod

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/build ./build
COPY --from=build /usr/src/app/scripts ./scripts
COPY --from=build /usr/src/app/prisma ./prisma 

RUN chmod +x ./scripts/start.sh

EXPOSE 3000
#
CMD ["/usr/src/app/scripts/start.sh"]

# RUN npx prisma generate
# RUN npx prisma migrate deploy
# CMD ["node", "build/server.js"]
