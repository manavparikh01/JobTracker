import Link from "next/link";
import { prisma } from "@/lib/db";
import { READING_ITEMS, WEEK_TITLES } from "@/lib/reading";
import { ReadingRow } from "@/components/ReadingRow";

export const dynamic = "force-dynamic";

export default async function ReadingPage() {
  const progress = await prisma.readingProgress.findMany();
  const byId = new Map(progress.map((p) => [p.itemId, p]));

  const total = READING_ITEMS.length;
  const done = READING_ITEMS.filter((i) => byId.get(i.id)?.done).length;
  const remaining = total - done;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const weeks = [...new Set(READING_ITEMS.map((i) => i.week))].sort((a, b) => a - b);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:py-12">
      <header className="mb-6 flex items-start justify-between">
        <div>
          <Link
            href="/"
            className="text-sm text-stone-500 underline-offset-2 hover:text-stone-800 hover:underline"
          >
            ← Home
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-stone-900">Reading list</h1>
          <p className="text-sm text-stone-500">8-week commute learning · AI SWE track</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-semibold tabular-nums text-stone-900">{remaining}</div>
          <div className="text-xs font-medium uppercase tracking-wide text-stone-500">left</div>
        </div>
      </header>

      {/* Progress */}
      <section className="mb-8">
        <div className="mb-1 flex items-center justify-between text-xs text-stone-500">
          <span>
            {done} of {total} done
          </span>
          <span className="tabular-nums">{pct}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200">
          <div
            className="h-full rounded-full bg-green-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        {done === total && total > 0 && (
          <p className="mt-2 text-sm font-medium text-green-700">
            🎉 Whole list done. Go build the project.
          </p>
        )}
      </section>

      {/* Grouped by week */}
      <div className="space-y-8">
        {weeks.map((week) => {
          const items = READING_ITEMS.filter((i) => i.week === week);
          const month = items[0].month;
          const weekDone = items.filter((i) => byId.get(i.id)?.done).length;
          return (
            <section key={week}>
              <div className="mb-2 flex items-baseline justify-between border-b border-stone-200 pb-1">
                <h2 className="text-sm font-semibold text-stone-800">
                  <span className="text-stone-400">Month {month} · Week {week}</span>{" "}
                  — {WEEK_TITLES[week]}
                </h2>
                <span className="shrink-0 text-xs tabular-nums text-stone-400">
                  {weekDone}/{items.length}
                </span>
              </div>
              <ul className="space-y-0.5">
                {items.map((item) => {
                  const p = byId.get(item.id);
                  return (
                    <ReadingRow
                      key={item.id}
                      item={item}
                      done={p?.done ?? false}
                      comment={p?.comment ?? ""}
                    />
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      <footer className="mt-10 text-center text-xs text-stone-400">
        One CORE item per commute. Optional only on high-energy days.
      </footer>
    </main>
  );
}
