import { Suspense } from "react";
import { addTodo } from "./actions";
import TodoList from "./todo-list";

export default function TodosPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-10">
      <h1 className="text-2xl font-bold">ToDo リスト</h1>

      {/* 追加フォーム。送信すると Server Action(addTodo) が実行される */}
      <form action={addTodo} className="flex gap-2">
        <input
          type="text"
          name="title"
          required
          placeholder="やることを入力"
          className="flex-1 rounded border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-900"
        />
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          追加
        </button>
      </form>

      {/* 一覧部分。DB読み取りが終わるまで fallback を表示（ビルド時はここでDB接続しない） */}
      <Suspense fallback={<p className="text-zinc-500">読み込み中…</p>}>
        <TodoList />
      </Suspense>
    </main>
  );
}
