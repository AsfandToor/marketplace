FROM node:20-alpine AS base

WORKDIR /app

FROM base AS dependencies
COPY package.json ./
RUN npm install

FROM dependencies AS prisma
COPY prisma ./prisma
RUN npx prisma generate

FROM base AS builder
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=prisma /app/node_modules/.prisma ./node_modules/.prisma
ENV DATABASE_URL=postgresql://admin:admin123@postgres:5432/mydatabase?schema=public
ENV RABBITMQ_URL=amqp://user:password@rabbitmq:5672
ENV SALT_ROUNDS=10
ENV JWT_SECRET=my-secret
RUN npm run build


FROM node:20-alpine AS runner

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY prisma ./prisma


EXPOSE 3001
CMD ["sh", "-c", "npx prisma db push && npx prisma db seed && node dist/main"]
