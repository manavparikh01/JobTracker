# Plan: Calendar + per-day dashboard navigation

## Context

The job tracker currently renders a single "today" dashboard at `/` (focus banner,
stats, today's tasks, full applications pipeline). The user wants to turn it into a
navigable daily journal:

- A **light calendar icon** in the dashboard header.
- It opens a **month-grid calendar** (Notion-style), freely navigable across months,
  defaulting to the current month.
- Each calendar day shows per-day stats: **applications submitted that day, tasks,
  completed tasks**.
- Clicking a day **opens that day as the dashboard** — same layout as the home page,
  scoped to that date.

Decisions confirmed with the user:
- **Day view always shows the full applications pipeline** (not filtered to that day);
  the day's application count appears as a stat + on the calendar tile.
- **Any day is editable** — add/check tasks and log an application dated to any day.
- **Free month navigation** (prev/next arrows, default current month).

## Key facts grounding the implementation

- Dashboard body lives in `app/page.tsx`; it fetches all applications, today's todos
  (`where day = dateKey()`), and the leetcode counter.
- "Today" is Eastern-pinned via `dateKey()` / `todayFocus()` in `lib/plan.ts`.
  `FOCUS_BY_DAY` is keyed 0=Sun..6=Sat.
- Mutations are server actions in `app/actions.ts`; `addTodo` currently hardcodes
  `day: dateKey()`. All actions call `revalidatePath("/")`.
- **Date-key gotcha (must respect):** `Todo.day` is an Eastern `YYYY-MM-DD` string set at
  creation. `Application.dateApplied` is a user-picked **date-only** value stored as
  midnight UTC; it is displayed via `dateApplied.toISOString().slice(0,10)`. So when
  grouping applications by calendar day, use the **UTC `toISOString().slice(0,10)`**, NOT
  the Eastern `dateKey()` (that would shift midnight-UTC back a day). Todos group by their
  stored `day` string. Each is internally consistent and both bucket to the correct tile.

## Implementation

### 1. `lib/plan.ts` — focus for an arbitrary day
Add `focusForDay(day: string): Focus` that derives the weekday from a `YYYY-MM-DD` string
using a fixed-date parse (`new Date(Date.UTC(y, m-1, d)).getUTCDay()`) so it's tz-safe.
Re-implement `todayFocus()` as `focusForDay(dateKey())`. Export a small
`appDayKey(d: Date)` helper returning `d.toISOString().slice(0,10)` for app grouping.

### 2. `components/DayDashboard.tsx` (new) — shared day-scoped dashboard
Extract the current `app/page.tsx` body into an async server component taking
`{ day }: { day: string }`. Behavior:
- `focus = focusForDay(day)`; header shows the day's long date + a **calendar icon link**
  to `/calendar`, and a "← Today" link when `day !== dateKey()`.
- Fetch: all applications (full pipeline, desc), `todo.findMany({ where: { day } })`,
  leetcode counter.
- Stats row: keep global pipeline stats (total / live / response rate / leetcode) and add
  an **"Applied this day"** stat = `apps.filter(a => appDayKey(a.dateApplied) === day).length`.
- Render `<TodoList day={day} todos={...} />` and `<Applications apps={...} defaultDate={day} />`.
- Banner label reads "Today's focus" when it's today, else "Focus for {date}".

### 3. `app/page.tsx` — home renders today
Replace body with `return <DayDashboard day={dateKey()} />`. Keep `export const dynamic = "force-dynamic"`.

### 4. `app/day/[date]/page.tsx` (new) — day route
`const { date } = await params` (Next 16 params is a Promise). Validate `date` against
`^\d{4}-\d{2}-\d{2}$`; on mismatch call `notFound()`. Render `<DayDashboard day={date} />`.
`export const dynamic = "force-dynamic"`.

### 5. `app/calendar/page.tsx` (new) — month grid
Server component reading `searchParams` (a Promise in Next 16): `m=YYYY-MM`, default to
current Eastern month (derived from `dateKey()`).
- Fetch all applications + all todos (personal scale — fetch and group in JS).
- Build a `Map<dayKey, { apps, tasks, done }>`: apps via `appDayKey`, todos via `day`,
  done = todos where `done`.
- Compute grid: weekday of the 1st (UTC fixed-date parse), leading blanks (week starts
  Sunday to match `FOCUS_BY_DAY`), one cell per day. Each cell is a `Link` to
  `/day/{dayKey}` showing the date number + compact badges (e.g. `3 apps`, `2/5`). Highlight
  today. Empty days show just the number.
- Header: month label, prev/next month `Link`s (`?m=` arithmetic, free range), a back-to-home
  link. No client component needed — navigation is link-based.

### 6. `components/TodoList.tsx` — accept a `day` prop
Add `day: string` to props. Render a hidden `<input type="hidden" name="day" value={day} />`
inside the add form so tasks attach to the viewed day. Optionally change the heading from
"Today's tasks" to "Tasks" when `day` isn't today (minor).

### 7. `components/Applications.tsx` — accept `defaultDate`
Add `defaultDate: string` prop; use it for the date-picker default instead of the local
`dateKey()` so logging from a day view defaults to that day.

### 8. `app/actions.ts` — day-aware todos + broader revalidation
- `addTodo`: read `const day = String(formData.get("day") ?? "") || dateKey()` and use it.
- Change every `revalidatePath("/")` to `revalidatePath("/", "layout")` so `/`,
  `/day/[date]`, and `/calendar` all refresh after a mutation.

### Calendar icon
Light inline SVG calendar (stroke, `text-stone-400 hover:text-stone-700`) wrapped in a
`Link href="/calendar"`, placed in the `DayDashboard` header so it appears on home and all
day views.

## Files

- New: `components/DayDashboard.tsx`, `app/day/[date]/page.tsx`, `app/calendar/page.tsx`
- Modified: `app/page.tsx`, `lib/plan.ts`, `app/actions.ts`,
  `components/TodoList.tsx`, `components/Applications.tsx`

## Verification

1. `npx tsc --noEmit` clean; `npm run dev`.
2. Home `/` renders today as before, now with a calendar icon in the header.
3. Click the icon → `/calendar` shows the current month grid; today highlighted.
4. On home, add a task + log an application (dated today) → calendar tile for today shows
   `1 app` and `0/1` (then `1/1` after checking the task).
5. Click a different day (e.g. `/day/2026-06-20`): add a task there → it persists with
   `day=2026-06-20`; "← Today" link returns home. Log an application from that day's view →
   it appears in the full pipeline and the calendar's June-20 tile app count increments.
6. Confirm the date-key gotcha: an application dated `2026-06-23` lands on the **June 23**
   tile (UTC slice), not June 22.
7. Prev/next month arrows navigate freely (e.g. to July) and back.
8. `npm run build` passes. Commit.
