FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM caddy:2-alpine

WORKDIR /app
ENV SITE_ROOT=/app/dist
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /app/dist

EXPOSE 80
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
