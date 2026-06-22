"use client";

import { useTransition } from "react";
import { bumpLeetcode } from "@/app/actions";

export function LeetcodeCounter({ value }: { value: number }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => startTransition(() => bumpLeetcode(-1))}
        disabled={isPending || value === 0}
        className="h-7 w-7 rounded-md border border-stone-300 text-stone-600 transition hover:bg-stone-100 disabled:opacity-40"
        aria-label="Decrement LeetCode count"
      >
        −
      </button>
      <span className="min-w-[2ch] text-center text-2xl font-semibold tabular-nums text-stone-900">
        {value}
      </span>
      <button
        onClick={() => startTransition(() => bumpLeetcode(1))}
        disabled={isPending}
        className="h-7 w-7 rounded-md border border-stone-300 text-stone-600 transition hover:bg-stone-100 disabled:opacity-40"
        aria-label="Increment LeetCode count"
      >
        +
      </button>
    </div>
  );
}
