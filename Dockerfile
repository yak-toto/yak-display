# ===========================
# 1️⃣ Build Stage (bun)
# ===========================
FROM oven/bun:1.4.4-alpine AS build

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
COPY --from=ghcr.io/astral-sh/uv:0.12.13 /uv /uvx /bin/

RUN bun run generate-client
RUN bun run build

# ===========================
# 2️⃣ Runtime Stage (nginx)
# ===========================
FROM nginx:1.31.6-alpine3.24

LABEL org.opencontainers.image.source=https://github.com/yak-toto/yak-display

COPY --from=build /app/dist /usr/share/nginx/html
