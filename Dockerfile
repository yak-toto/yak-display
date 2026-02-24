# ===========================
# 1️⃣ Build Stage (node)
# ===========================
FROM node:22.22.0-alpine3.23 AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
COPY --from=ghcr.io/astral-sh/uv:0.9.18 /uv /uvx /bin/

RUN npm run generate-client
RUN npm run build

# ===========================
# 2️⃣ Runtime Stage (nginx)
# ===========================
FROM nginx:1.29.5-alpine3.23

LABEL org.opencontainers.image.source=https://github.com/yak-toto/yak-display

COPY --from=build /app/dist /usr/share/nginx/html
