import Link from "next/link";
import { prisma } from "@/lib/db";
import { LEADS } from "@/lib/leads";
import { LeadRow } from "@/components/LeadRow";

export const dynamic = "force-dynamic";

type LeadState = "new" | "applied" | "dismissed";

export default async function LeadsPage() {
  const states = await prisma.leadStatus.findMany();
  const byId = new Map(states.map((s) => [s.leadId, s.status as LeadState]));

  const withStatus = LEADS.map((lead) => ({
    lead,
    status: byId.get(lead.id) ?? ("new" as LeadState),
  }));

  const fresh = withStatus.filter((l) => l.status === "new");
  const applied = withStatus.filter((l) => l.status === "applied");
  const dismissed = withStatus.filter((l) => l.status === "dismissed");

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
          <h1 className="mt-1 text-2xl font-bold text-stone-900">Job leads</h1>
          <p className="text-sm text-stone-500">
            Fresh SWE roles · big cities + remote · $140k+ · found for you each weekday
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-semibold tabular-nums text-stone-900">
            {fresh.length}
          </div>
          <div className="text-xs font-medium uppercase tracking-wide text-stone-500">
            new
          </div>
        </div>
      </header>

      {/* New leads */}
      <section className="mb-8">
        <div className="mb-2 flex items-baseline justify-between border-b border-stone-200 pb-1">
          <h2 className="text-sm font-semibold text-stone-800">New</h2>
          <span className="shrink-0 text-xs tabular-nums text-stone-400">
            {fresh.length}
          </span>
        </div>
        {fresh.length === 0 ? (
          <p className="py-6 text-center text-sm text-stone-400">
            No new leads right now. The daily finder adds them each weekday morning.
          </p>
        ) : (
          <ul className="space-y-0.5">
            {fresh.map(({ lead, status }) => (
              <LeadRow key={lead.id} lead={lead} status={status} />
            ))}
          </ul>
        )}
      </section>

      {/* Applied */}
      {applied.length > 0 && (
        <section className="mb-8">
          <div className="mb-2 flex items-baseline justify-between border-b border-stone-200 pb-1">
            <h2 className="text-sm font-semibold text-stone-800">
              Applied <span className="text-stone-400">— in your pipeline</span>
            </h2>
            <span className="shrink-0 text-xs tabular-nums text-stone-400">
              {applied.length}
            </span>
          </div>
          <ul className="space-y-0.5">
            {applied.map(({ lead, status }) => (
              <LeadRow key={lead.id} lead={lead} status={status} />
            ))}
          </ul>
        </section>
      )}

      {/* Dismissed */}
      {dismissed.length > 0 && (
        <section className="mb-8">
          <div className="mb-2 flex items-baseline justify-between border-b border-stone-200 pb-1">
            <h2 className="text-sm font-semibold text-stone-400">Dismissed</h2>
            <span className="shrink-0 text-xs tabular-nums text-stone-400">
              {dismissed.length}
            </span>
          </div>
          <ul className="space-y-0.5">
            {dismissed.map(({ lead, status }) => (
              <LeadRow key={lead.id} lead={lead} status={status} />
            ))}
          </ul>
        </section>
      )}

      <footer className="mt-10 text-center text-xs text-stone-400">
        Hit “Applied” to drop a lead straight into your Applications — no re-typing.
      </footer>
    </main>
  );
}
