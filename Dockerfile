# 部品をそろえる
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 2. アプリを組み立てる（ビルド）
FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Prisma Client を生成（schema.prisma から。DB接続は不要）。
# 生成物は app/generated/prisma に出力され、次の build で standalone にバンドルされる。
RUN npx prisma generate
# ビルド。Cache Components + connection() により、ここでDBへは接続しない。
RUN npm run build

# 3. 完成品だけを箱に詰める
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]