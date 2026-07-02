"use client";

import { useState, useTransition } from "react";
import { toggleReadingItem, setReadingComment } from "@/app/actions";
import type { ReadingItem } from "@/lib/reading";

const KIND_ICON: Record<ReadingItem["kind"], string> = {
  video: "🎬",
  article: "📄",
  course: "🎓",
};

export function ReadingRow({
  item,
  done,
  comment,
}: {
  item: ReadingItem;
  done: boolean;
  comment: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(comment);

  const save = () =>
    startTransition(async () => {
      await setReadingComment(item.id, text);
      setEditing(false);
    });

  return (
    <li className="group flex gap-3 rounded-lg px-2 py-2 hover:bg-stone-50">
      <input
        type="checkbox"
        checked={done}
        onChange={() => startTransition(() => toggleReadingItem(item.id, !done))}
        className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-stone-900"
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="shrink-0 text-sm" aria-hidden="true">
            {KIND_ICON[item.kind]}
          </span>
          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm font-medium underline-offset-2 hover:underline ${
                done ? "text-stone-400 line-through" : "text-stone-800"
              }`}
            >
              {item.title}
            </a>
          ) : (
            <span
              className={`text-sm font-medium ${
                done ? "text-stone-400 line-through" : "text-stone-800"
              }`}
            >
              {item.title}
            </span>
          )}
          <span className="shrink-0 rounded-full bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium text-stone-500">
            {item.day}
          </span>
          {!item.core && (
            <span className="shrink-0 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
              optional
            </span>
          )}
        </div>

        {item.note && (
          <p className="mt-0.5 text-xs text-stone-400">{item.note}</p>
        )}

        {/* Comment / note */}
        {editing ? (
          <div className="mt-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoFocus
              rows={2}
              placeholder="Your notes on this one…"
              className="w-full rounded-lg border border-stone-300 px-2 py-1.5 text-sm outline-none focus:border-stone-500"
            />
            <div className="mt-1 flex gap-2">
              <button
                onClick={save}
                disabled={isPending}
                className="rounded-md bg-stone-900 px-3 py-1 text-xs font-medium text-white transition hover:bg-stone-700 disabled:opacity-50"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setText(comment);
                  setEditing(false);
                }}
                className="rounded-md px-3 py-1 text-xs font-medium text-stone-500 transition hover:bg-stone-100"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : comment ? (
          <button
            onClick={() => setEditing(true)}
            className="mt-1 block w-full rounded-md border-l-2 border-stone-300 bg-stone-50 px-2 py-1 text-left text-xs italic text-stone-600 transition hover:border-stone-500"
          >
            {comment}
          </button>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="mt-1 text-xs text-stone-400 opacity-0 transition hover:text-stone-700 group-hover:opacity-100"
          >
            + Add note
          </button>
        )}
      </div>
    </li>
  );
}
