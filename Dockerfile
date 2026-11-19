# ===========================
# 1️⃣ Build Stage (bun)
# ===========================
FROM oven/bun:1.4.4-alpine@sha256:4cf82f5686b196504fe119db3fcd9185b191f82ece82c40680e597228ec6070a AS build

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
FROM nginx:1.31.9-alpine3.24@sha256:90b6bd2aec278b16b98221d64deb1d6d35d164567f507ab0716e6053878315aa

LABEL org.opencontainers.image.source=https://github.com/yak-toto/yak-display

COPY --from=build /app/dist /usr/share/nginx/html
