// The weekly engine from your 3-month plan, mapped to days of the week.
// Tue = Learn, Wed = Apply, Thu = Network, Mon/Fri = LeetCode night,
// Sat/Sun = weekend deep-work block.

export type Focus = {
  emoji: string;
  title: string;
  detail: string;
};

const FOCUS_BY_DAY: Record<number, Focus> = {
  0: { emoji: "🧱", title: "Weekend block", detail: "One 3–4 hr deep block: project build, mock interview, or system-design study." },
  1: { emoji: "🧮", title: "LeetCode night", detail: "1–1.5 hr at a desk. 2–3 problems. Pattern fluency, not volume." },
  2: { emoji: "📚", title: "Learn (commute)", detail: "Watch/read LLM-app & RAG system design. Light, passive." },
  3: { emoji: "📨", title: "Apply (commute)", detail: "5–8 targeted applications. Quality over spray." },
  4: { emoji: "🤝", title: "Network (commute)", detail: "Send 3–5 referral / coffee-chat messages. Highest ROI." },
  5: { emoji: "🧮", title: "LeetCode night", detail: "1–1.5 hr at a desk. 2–3 problems. Pattern fluency, not volume." },
  6: { emoji: "🧱", title: "Weekend block", detail: "One 3–4 hr deep block: project build, mock interview, or system-design study." },
};

// Pin "today" to Eastern time so the day rolls over at your midnight, not the
// server's (Vercel runs on UTC). Intl handles daylight saving automatically.
export const TIME_ZONE = "America/New_York";

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
};

// Day-of-week (0=Sun..6=Sat) in Eastern time.
function easternWeekday(date: Date): number {
  const short = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "short",
  }).format(date);
  return WEEKDAY_INDEX[short];
}

export function todayFocus(date = new Date()): Focus {
  return FOCUS_BY_DAY[easternWeekday(date)];
}

// Focus for an arbitrary YYYY-MM-DD string. Weekday is derived from a fixed-date
// parse (no timezone math) so it's correct regardless of the server's clock.
export function focusForDay(day: string): Focus {
  const [y, m, d] = day.split("-").map(Number);
  const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return FOCUS_BY_DAY[weekday];
}

// Calendar-day key for an application's date-only `dateApplied` (stored at
// midnight UTC). Use the UTC slice — NOT the Eastern dateKey — so the day it was
// picked for is the day it buckets into.
export function appDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// YYYY-MM-DD key for "today" in Eastern time (used to group daily todos).
export function dateKey(date = new Date()): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export const STATUSES = ["applied", "screen", "onsite", "offer", "rejected"] as const;
export type Status = (typeof STATUSES)[number];

export const STATUS_LABELS: Record<Status, string> = {
  applied: "Applied",
  screen: "Phone screen",
  onsite: "Onsite",
  offer: "Offer",
  rejected: "Rejected",
};
