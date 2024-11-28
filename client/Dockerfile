FROM node:20-alpine AS base

WORKDIR /app

FROM base AS dependencies
COPY package.json ./
RUN npm install

FROM base AS builder
COPY . .
COPY --from=dependencies ./app/node_modules ./node_modules
ENV NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
ENV NEXT_PUBLIC_API_INTERNAL_URL=http://nestjs:3001
ENV NEXTAUTH_SECRET=marketplace
RUN npm run build


FROM node:20-alpine AS runner


ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]
