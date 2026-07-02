import Link from "next/link";
import { prisma } from "@/lib/db";
import { focusForDay, dateKey, appDayKey } from "@/lib/plan";
import { TodoList } from "@/components/TodoList";
import { Applications, type AppRow } from "@/components/Applications";
import { LeetcodeCounter } from "@/components/LeetcodeCounter";

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="text-2xl font-semibold tabular-nums text-stone-900">{value}</div>
      <div className="text-xs font-medium uppercase tracking-wide text-stone-500">{label}</div>
      {hint && <div className="mt-0.5 text-[11px] text-stone-400">{hint}</div>}
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M3 10h18M8 2v4M16 2v4" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

// The full dashboard, scoped to a single day. Used by `/` (today) and `/day/[date]`.
export async function DayDashboard({ day }: { day: string }) {
  const today = dateKey();
  const isToday = day === today;
  const focus = focusForDay(day);

  const [apps, todos, leetcode] = await Promise.all([
    prisma.application.findMany({ orderBy: { dateApplied: "desc" } }),
    prisma.todo.findMany({ where: { day }, orderBy: { createdAt: "asc" } }),
    prisma.counter.findUnique({ where: { key: "leetcode" } }),
  ]);

  const total = apps.length;
  const responded = apps.filter((a) => ["screen", "onsite", "offer"].includes(a.status)).length;
  const offers = apps.filter((a) => a.status === "offer").length;
  const live = apps.filter((a) => ["screen", "onsite"].includes(a.status)).length;
  const referrals = apps.filter((a) => a.referral).length;
  const responseRate = total ? Math.round((responded / total) * 100) : 0;
  const tasksDone = todos.filter((t) => t.done).length;
  const appliedThisDay = apps.filter((a) => appDayKey(a.dateApplied) === day).length;

  const appRows: AppRow[] = apps.map((a) => ({
    id: a.id,
    company: a.company,
    role: a.role,
    dateApplied: appDayKey(a.dateApplied),
    referral: a.referral,
    status: a.status,
    link: a.link,
  }));

  // Format the day label without timezone drift (noon UTC, render in UTC).
  const labelDate = new Date(`${day}T12:00:00Z`);
  const longDate = labelDate.toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:py-12">
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">
            {isToday ? "Job Tracker" : longDate}
          </h1>
          <p className="text-sm text-stone-500">
            {isToday ? longDate : "Viewing a single day"}
            {" · "}
            <span className="text-stone-400">
              {appliedThisDay} applied · {tasksDone}/{todos.length} tasks done
            </span>
          </p>
          {!isToday && (
            <Link
              href="/"
              className="mt-1 inline-block text-sm text-stone-500 underline-offset-2 hover:text-stone-800 hover:underline"
            >
              ← Today
            </Link>
          )}
        </div>
        <div className="mt-1 flex items-center gap-3">
          <Link
            href="/reading"
            aria-label="Open reading list"
            title="Reading list"
            className="text-stone-400 transition hover:text-stone-700"
          >
            <BookIcon />
          </Link>
          <Link
            href="/calendar"
            aria-label="Open calendar"
            title="Calendar"
            className="text-stone-400 transition hover:text-stone-700"
          >
            <CalendarIcon />
          </Link>
        </div>
      </header>

      {/* Focus for the day, from the 3-month plan */}
      <section className="mb-6 flex items-start gap-3 rounded-2xl border border-stone-900 bg-stone-900 p-5 text-white">
        <span className="text-3xl leading-none">{focus.emoji}</span>
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-stone-400">
            {isToday ? "Today's focus" : "Focus for this day"}
          </div>
          <div className="text-lg font-semibold">{focus.title}</div>
          <div className="text-sm text-stone-300">{focus.detail}</div>
        </div>
      </section>

      {/* Pipeline stats (global) */}
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
        <TodoList
          day={day}
          isToday={isToday}
          todos={todos.map((t) => ({ id: t.id, text: t.text, done: t.done }))}
        />
      </div>

      <Applications apps={appRows} defaultDate={day} />

      <footer className="mt-8 text-center text-xs text-stone-400">
        Light work on the train. Hard work at a desk. Keep the gym.
      </footer>
    </main>
  );
}
