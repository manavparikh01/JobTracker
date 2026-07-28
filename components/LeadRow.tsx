"use client";

import { useTransition } from "react";
import { markLeadApplied, setLeadStatus } from "@/app/actions";
import type { Lead } from "@/lib/leads";

export function LeadRow({
  lead,
  status,
}: {
  lead: Lead;
  status: "new" | "applied" | "dismissed";
}) {
  const [isPending, startTransition] = useTransition();

  const applied = status === "applied";
  const dismissed = status === "dismissed";

  return (
    <li className="group flex flex-col gap-2 rounded-lg px-2 py-3 hover:bg-stone-50 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          {lead.url ? (
            <a
              href={lead.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm font-semibold underline-offset-2 hover:underline ${
                applied || dismissed ? "text-stone-400" : "text-stone-900"
              }`}
            >
              {lead.company}
            </a>
          ) : (
            <span
              className={`text-sm font-semibold ${
                applied || dismissed ? "text-stone-400" : "text-stone-900"
              }`}
            >
              {lead.company}
            </span>
          )}
          <span
            className={`text-sm ${
              applied || dismissed ? "text-stone-400" : "text-stone-600"
            }`}
          >
            {lead.role}
          </span>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          {lead.location && (
            <span className="rounded-full bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium text-stone-500">
              📍 {lead.location}
            </span>
          )}
          {lead.salary && (
            <span className="rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700">
              💰 {lead.salary}
            </span>
          )}
          {lead.source && lead.source !== "system" && (
            <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
              {lead.source}
            </span>
          )}
          <span className="text-[10px] text-stone-400">found {lead.foundOn}</span>
        </div>

        {lead.note && <p className="mt-1 text-xs text-stone-400">{lead.note}</p>}
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2 sm:pt-0.5">
        {applied ? (
          <span className="rounded-md bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
            ✓ Applied
          </span>
        ) : dismissed ? (
          <button
            onClick={() =>
              startTransition(() => setLeadStatus(lead.id, "new"))
            }
            disabled={isPending}
            className="rounded-md px-2.5 py-1 text-xs font-medium text-stone-500 transition hover:bg-stone-100 disabled:opacity-50"
          >
            Restore
          </button>
        ) : (
          <>
            <button
              onClick={() =>
                startTransition(() =>
                  markLeadApplied({
                    id: lead.id,
                    company: lead.company,
                    role: lead.role,
                    url: lead.url,
                  }),
                )
              }
              disabled={isPending}
              className="rounded-md bg-stone-900 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-stone-700 disabled:opacity-50"
            >
              Applied ✓
            </button>
            <button
              onClick={() =>
                startTransition(() => setLeadStatus(lead.id, "dismissed"))
              }
              disabled={isPending}
              className="rounded-md px-2 py-1 text-xs font-medium text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 disabled:opacity-50"
              aria-label="Dismiss lead"
              title="Dismiss"
            >
              Dismiss
            </button>
          </>
        )}
      </div>
    </li>
  );
}
