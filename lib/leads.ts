// Job leads. The *content* (the actual listings) lives in data/leads.json and is
// appended to by the daily job-finder task (scripts/add-leads.mjs). Only per-lead
// triage state (new / applied / dismissed) lives in the DB (LeadStatus), keyed by
// the lead's stable `id`. This mirrors the reading-list pattern (lib/reading.ts +
// ReadingProgress).

import rawLeads from "@/data/leads.json";

export type Lead = {
  id: string; // stable slug — set once, never change (keys DB state)
  company: string;
  role: string;
  location: string;
  salary?: string;
  url?: string;
  source?: string; // e.g. "LinkedIn", "Greenhouse", "Company site"
  note?: string;
  foundOn: string; // YYYY-MM-DD the lead was added
};

// Newest first, so today's finds sit at the top of the page.
export const LEADS: Lead[] = ([...(rawLeads as Lead[])]).sort((a, b) =>
  b.foundOn.localeCompare(a.foundOn),
);

// Stable slug for a lead, so re-running the finder doesn't create duplicates and
// DB state stays attached. Keep this in sync with scripts/add-leads.mjs.
export function leadSlug(company: string, role: string, url?: string): string {
  const base = `${company}|${role}|${url ?? ""}`.toLowerCase();
  return base
    .replace(/https?:\/\//g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
