"use client";

import { useRef, useTransition } from "react";
import { addTodo, toggleTodo, deleteTodo } from "@/app/actions";

export type TodoItem = { id: string; text: string; done: boolean };

export function TodoList({ todos }: { todos: TodoItem[] }) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const remaining = todos.filter((t) => !t.done).length;

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
          Today&apos;s tasks
        </h2>
        <span className="text-xs text-stone-400">
          {remaining} left / {todos.length}
        </span>
      </div>

      <form
        ref={formRef}
        action={(fd) => {
          startTransition(async () => {
            await addTodo(fd);
            formRef.current?.reset();
          });
        }}
        className="mb-3 flex gap-2"
      >
        <input
          name="text"
          placeholder="Add a task for today…"
          autoComplete="off"
          className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-700 disabled:opacity-50"
        >
          Add
        </button>
      </form>

      <ul className="space-y-1">
        {todos.length === 0 && (
          <li className="py-4 text-center text-sm text-stone-400">
            Nothing yet. Add the first thing you want done today.
          </li>
        )}
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="group flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-stone-50"
          >
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() =>
                startTransition(() => toggleTodo(todo.id, !todo.done))
              }
              className="h-4 w-4 cursor-pointer accent-stone-900"
            />
            <span
              className={`flex-1 text-sm ${
                todo.done ? "text-stone-400 line-through" : "text-stone-800"
              }`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => startTransition(() => deleteTodo(todo.id))}
              className="text-stone-300 opacity-0 transition hover:text-red-500 group-hover:opacity-100"
              aria-label="Delete task"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
