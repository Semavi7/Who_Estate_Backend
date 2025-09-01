# Multi-stage build için base image
FROM node:20-alpine AS base
WORKDIR /usr/src/app
# Package files'ları kopyala
COPY package*.json ./

# Development dependencies ile build stage
FROM base AS build
# İlk önce tüm dependencies'leri yükle (dev dahil, build için gerekli)
RUN npm install
COPY . .
# .env dosyasını build sırasında kopyalama (güvenlik)
# Build işlemi
RUN npm run build

# Production stage
FROM node:20-alpine AS production
WORKDIR /usr/src/app

# Güvenlik için non-root user oluştur
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Production dependencies'leri ayrı stage'de yükle
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

# Build files'ları kopyala
COPY --from=build /usr/src/app/dist ./dist

# User'ı değiştir
USER nestjs

# Port expose et
EXPOSE 3001

# Health check ekle (opsiyonel)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start komutu
CMD ["node", "dist/main"]