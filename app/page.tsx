import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-4 bg-zinc-50 font-sans dark:bg-black">
      <div>minipcで実行中!</div>
      <Link href="/todos" className="text-blue-600 underline hover:text-blue-700">
        ToDo リストへ
      </Link>
    </div>
  );
}
