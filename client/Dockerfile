FROM node:20-alpine AS base

WORKDIR /app

FROM base AS dependencies
COPY package.json ./
RUN npm install --force

FROM base AS builder
COPY . .
COPY --from=dependencies ./app/node_modules ./node_modules
RUN npm run build


FROM node:20-alpine AS runner


ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY .env .env

EXPOSE 3000
CMD ["npm", "start"]
