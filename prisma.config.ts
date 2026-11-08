import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

// Prisma CLI（migrate など）が使う設定ファイル。
// Prisma 7 では .env を自動では読まないので、ここで明示的に読み込む。
// ・Mac の開発: .env.local（SSHトンネル経由で localhost:5432 に接続）
// ・ミニPC/本番: .env
// dotenv は「すでにセット済みの変数は上書きしない」ので、先に読んだ .env.local が優先される。
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    // マイグレーション履歴（テーブル作成のSQL）の保存先。Git にコミットする
    path: "prisma/migrations",
  },
  datasource: {
    // generate 時は DATABASE_URL が無くてもよいよう、env() ではなく process.env を使う
    url: process.env.DATABASE_URL as string,
  },
});
