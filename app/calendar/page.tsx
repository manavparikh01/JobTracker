import Link from "next/link";
import { prisma } from "@/lib/db";
import { dateKey, appDayKey } from "@/lib/plan";

export const dynamic = "force-dynamic";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Shift a YYYY-MM month key by `delta` months.
function shiftMonth(monthKey: string, delta: number): string {
  const [y, m] = monthKey.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

type Cell = { apps: number; tasks: number; done: number };

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ m?: string }>;
}) {
  const { m } = await searchParams;
  const today = dateKey();
  const monthKey = m && /^\d{4}-\d{2}$/.test(m) ? m : today.slice(0, 7);
  const [yy, mm] = monthKey.split("-").map(Number);

  const daysInMonth = new Date(Date.UTC(yy, mm, 0)).getUTCDate();
  const firstWeekday = new Date(Date.UTC(yy, mm - 1, 1)).getUTCDay(); // 0=Sun

  const [apps, todos] = await Promise.all([
    prisma.application.findMany(),
    prisma.todo.findMany(),
  ]);

  // Aggregate per-day counts.
  const byDay = new Map<string, Cell>();
  const cellFor = (key: string): Cell => {
    let c = byDay.get(key);
    if (!c) {
      c = { apps: 0, tasks: 0, done: 0 };
      byDay.set(key, c);
    }
    return c;
  };
  for (const a of apps) cellFor(appDayKey(a.dateApplied)).apps++;
  for (const t of todos) {
    const c = cellFor(t.day);
    c.tasks++;
    if (t.done) c.done++;
  }

  const monthLabel = new Date(Date.UTC(yy, mm - 1, 1)).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "long",
    year: "numeric",
  });
  const prevMonth = shiftMonth(monthKey, -1);
  const nextMonth = shiftMonth(monthKey, 1);

  const blanks = Array.from({ length: firstWeekday });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:py-12">
      <header className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm text-stone-500 underline-offset-2 hover:text-stone-800 hover:underline"
        >
          ← Home
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href={`/calendar?m=${prevMonth}`}
            aria-label="Previous month"
            className="rounded-md border border-stone-300 px-2 py-1 text-stone-600 transition hover:bg-stone-100"
          >
            ‹
          </Link>
          <h1 className="min-w-[10ch] text-center text-lg font-semibold text-stone-900">
            {monthLabel}
          </h1>
          <Link
            href={`/calendar?m=${nextMonth}`}
            aria-label="Next month"
            className="rounded-md border border-stone-300 px-2 py-1 text-stone-600 transition hover:bg-stone-100"
          >
            ›
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium uppercase tracking-wide text-stone-400">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {blanks.map((_, i) => (
          <div key={`b${i}`} />
        ))}
        {days.map((d) => {
          const key = `${monthKey}-${String(d).padStart(2, "0")}`;
          const cell = byDay.get(key);
          const isToday = key === today;
          return (
            <Link
              key={key}
              href={`/day/${key}`}
              className={`flex min-h-[78px] flex-col rounded-lg border p-1.5 text-left transition hover:bg-stone-50 sm:min-h-[92px] ${
                isToday
                  ? "border-stone-900 ring-1 ring-stone-900"
                  : "border-stone-200"
              }`}
            >
              <span
                className={`text-xs font-semibold ${
                  isToday ? "text-stone-900" : "text-stone-500"
                }`}
              >
                {d}
              </span>
              <span className="mt-auto space-y-0.5">
                {cell?.apps ? (
                  <span className="block rounded bg-blue-100 px-1 text-[10px] font-medium text-blue-700">
                    {cell.apps} app{cell.apps === 1 ? "" : "s"}
                  </span>
                ) : null}
                {cell?.tasks ? (
                  <span
                    className={`block rounded px-1 text-[10px] font-medium ${
                      cell.done === cell.tasks
                        ? "bg-green-100 text-green-700"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    ✓ {cell.done}/{cell.tasks}
                  </span>
                ) : null}
              </span>
            </Link>
          );
        })}
      </div>

      <footer className="mt-6 text-center text-xs text-stone-400">
        Tap any day to open it.
      </footer>
    </main>
  );
}
