import { prisma } from "@/lib/db";
import { todayFocus, dateKey } from "@/lib/plan";
import { TodoList } from "@/components/TodoList";
import { Applications, type AppRow } from "@/components/Applications";
import { LeetcodeCounter } from "@/components/LeetcodeCounter";

// Always render with fresh data from the DB.
export const dynamic = "force-dynamic";

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="text-2xl font-semibold tabular-nums text-stone-900">{value}</div>
      <div className="text-xs font-medium uppercase tracking-wide text-stone-500">{label}</div>
      {hint && <div className="mt-0.5 text-[11px] text-stone-400">{hint}</div>}
    </div>
  );
}

export default async function Home() {
  const today = dateKey();
  const focus = todayFocus();

  const [apps, todos, leetcode] = await Promise.all([
    prisma.application.findMany({ orderBy: { dateApplied: "desc" } }),
    prisma.todo.findMany({ where: { day: today }, orderBy: { createdAt: "asc" } }),
    prisma.counter.findUnique({ where: { key: "leetcode" } }),
  ]);

  const total = apps.length;
  const responded = apps.filter((a) => ["screen", "onsite", "offer"].includes(a.status)).length;
  const offers = apps.filter((a) => a.status === "offer").length;
  const live = apps.filter((a) => ["screen", "onsite"].includes(a.status)).length;
  const referrals = apps.filter((a) => a.referral).length;
  const responseRate = total ? Math.round((responded / total) * 100) : 0;
  const tasksDone = todos.filter((t) => t.done).length;

  const appRows: AppRow[] = apps.map((a) => ({
    id: a.id,
    company: a.company,
    role: a.role,
    dateApplied: a.dateApplied.toISOString().slice(0, 10),
    referral: a.referral,
    status: a.status,
    link: a.link,
  }));

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:py-12">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Job Tracker</h1>
        <p className="text-sm text-stone-500">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </header>

      {/* Today's focus from the 3-month plan */}
      <section className="mb-6 flex items-start gap-3 rounded-2xl border border-stone-900 bg-stone-900 p-5 text-white">
        <span className="text-3xl leading-none">{focus.emoji}</span>
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-stone-400">
            Today&apos;s focus
          </div>
          <div className="text-lg font-semibold">{focus.title}</div>
          <div className="text-sm text-stone-300">{focus.detail}</div>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Applications" value={String(total)} hint={`${referrals} via referral`} />
        <Stat
          label="Live pipelines"
          value={String(live)}
          hint={`${offers} offer${offers === 1 ? "" : "s"}`}
        />
        <Stat label="Response rate" value={`${responseRate}%`} hint={`${responded}/${total} replied`} />
        <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-medium uppercase tracking-wide text-stone-500">
            LeetCode solved
          </div>
          <div className="mt-1">
            <LeetcodeCounter value={leetcode?.value ?? 0} />
          </div>
        </div>
      </section>

      <div className="mb-6">
        <TodoList todos={todos.map((t) => ({ id: t.id, text: t.text, done: t.done }))} />
        {todos.length > 0 && (
          <p className="mt-1 px-1 text-xs text-stone-400">{tasksDone} done today</p>
        )}
      </div>

      <Applications apps={appRows} />

      <footer className="mt-8 text-center text-xs text-stone-400">
        Light work on the train. Hard work at a desk. Keep the gym.
      </footer>
    </main>
  );
}
