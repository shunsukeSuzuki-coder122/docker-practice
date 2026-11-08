import { connection } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { toggleTodo, deleteTodo } from "./actions";

// ToDo 一覧を表示する Server Component（サーバ側でDBを読む）。
// page.tsx 側で <Suspense> に包んで使う。
export default async function TodoList() {
  // connection() 以降は「実際のアクセス（リクエスト）が来てから」実行される。
  // → Docker のビルド中（DBがまだ無い）に接続しようとして失敗するのを防ぐ。
  await connection();

  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: "desc" }, // 新しい順
  });

  if (todos.length === 0) {
    return <p className="text-zinc-500">まだ ToDo はありません。</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="flex items-center gap-3 rounded border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        >
          {/* 完了 / 未完了 の切り替えボタン */}
          <form action={toggleTodo}>
            <input type="hidden" name="id" value={todo.id} />
            <input type="hidden" name="done" value={String(todo.done)} />
            <button
              type="submit"
              aria-label={todo.done ? "未完了に戻す" : "完了にする"}
              className="text-xl leading-none"
            >
              {todo.done ? "☑" : "☐"}
            </button>
          </form>

          {/* タイトル（完了済みは打ち消し線） */}
          <span
            className={
              "flex-1 " +
              (todo.done ? "text-zinc-400 line-through" : "text-zinc-900 dark:text-zinc-100")
            }
          >
            {todo.title}
          </span>

          {/* 削除ボタン */}
          <form action={deleteTodo}>
            <input type="hidden" name="id" value={todo.id} />
            <button
              type="submit"
              className="rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
            >
              削除
            </button>
          </form>
        </li>
      ))}
    </ul>
  );
}
