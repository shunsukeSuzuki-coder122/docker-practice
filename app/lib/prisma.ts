import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

// Prisma 7 は Rust 製エンジンを使わず、Node 用の pg ドライバ経由で接続する。
// そのための「ドライバアダプタ」。接続先は環境変数 DATABASE_URL から取る。
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// 開発モードでは next が頻繁にモジュールを再読み込みするため、
// そのたびに PrismaClient を作ると DB 接続が増えすぎる。
// globalThis に1つだけ保持して使い回す（本番では毎回新規でよい）。
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
