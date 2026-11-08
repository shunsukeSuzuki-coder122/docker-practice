"use server";

// このファイルの関数は「Server Actions」。ブラウザのフォーム送信を受けて
// サーバ側で実行され、DBを書き換える。API Route は作らずこれで完結する。

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

// ToDo を追加する
export async function addTodo(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  // 空文字は登録しない（サーバ側でもきちんと検証する）
  if (title === "") return;

  await prisma.todo.create({ data: { title } });

  // /todos ページのキャッシュを更新し、最新の一覧を表示させる
  revalidatePath("/todos");
}

// 完了 / 未完了 を切り替える
export async function toggleTodo(formData: FormData) {
  const id = Number(formData.get("id"));
  const current = formData.get("done") === "true"; // 今の状態
  if (!Number.isInteger(id)) return;

  await prisma.todo.update({
    where: { id },
    data: { done: !current }, // 反転させる
  });

  revalidatePath("/todos");
}

// ToDo を削除する
export async function deleteTodo(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await prisma.todo.delete({ where: { id } });

  revalidatePath("/todos");
}
