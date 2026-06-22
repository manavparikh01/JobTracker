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

export function todayFocus(date = new Date()): Focus {
  return FOCUS_BY_DAY[date.getDay()];
}

// Local YYYY-MM-DD key for "today" (used to group daily todos).
export function dateKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
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
