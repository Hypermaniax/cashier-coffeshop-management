# syntax=docker/dockerfile:1

# ---- Stage 1: build ----
FROM node:20-alpine AS builder
WORKDIR /app

# hanya copy file yg dibutuhkan utk install + build
COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

# ---- Stage 2: runtime ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# standalone sudah include node runtime subset + app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

# upload folder di-mount sebagai volume di runtime (lihat docker-compose)
CMD ["node", "server.js"]
