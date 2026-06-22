"use client";

import { useRef, useState, useTransition } from "react";
import {
  addApplication,
  updateApplicationStatus,
  deleteApplication,
} from "@/app/actions";
import { STATUSES, STATUS_LABELS, type Status } from "@/lib/plan";

export type AppRow = {
  id: string;
  company: string;
  role: string;
  dateApplied: string; // ISO date (yyyy-mm-dd)
  referral: boolean;
  status: string;
  link: string | null;
};

const STATUS_STYLES: Record<Status, string> = {
  applied: "bg-stone-100 text-stone-700",
  screen: "bg-blue-100 text-blue-700",
  onsite: "bg-amber-100 text-amber-800",
  offer: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export function Applications({ apps }: { apps: AppRow[] }) {
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
          Applications
        </h2>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="rounded-lg bg-stone-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-stone-700"
        >
          {showForm ? "Close" : "+ Add"}
        </button>
      </div>

      {showForm && (
        <form
          ref={formRef}
          action={(fd) => {
            startTransition(async () => {
              await addApplication(fd);
              formRef.current?.reset();
              setShowForm(false);
            });
          }}
          className="mb-4 grid grid-cols-1 gap-2 rounded-xl bg-stone-50 p-3 sm:grid-cols-2"
        >
          <input
            name="company"
            placeholder="Company *"
            required
            autoComplete="off"
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
          />
          <input
            name="role"
            placeholder="Role *"
            required
            autoComplete="off"
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
          />
          <input
            name="dateApplied"
            type="date"
            defaultValue={today}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
          />
          <input
            name="link"
            placeholder="Job link (optional)"
            autoComplete="off"
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
          />
          <label className="flex items-center gap-2 text-sm text-stone-700">
            <input
              name="referral"
              type="checkbox"
              className="h-4 w-4 accent-stone-900"
            />
            Have a referral
          </label>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-700 disabled:opacity-50 sm:col-start-2"
          >
            Save application
          </button>
        </form>
      )}

      {apps.length === 0 ? (
        <p className="py-6 text-center text-sm text-stone-400">
          No applications yet. Hit “+ Add” after you send your first one.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-left text-xs uppercase tracking-wide text-stone-400">
                <th className="py-2 pr-3 font-medium">Company</th>
                <th className="py-2 pr-3 font-medium">Role</th>
                <th className="py-2 pr-3 font-medium">Applied</th>
                <th className="py-2 pr-3 font-medium">Ref</th>
                <th className="py-2 pr-3 font-medium">Status</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {apps.map((app) => (
                <tr
                  key={app.id}
                  className="group border-b border-stone-100 last:border-0"
                >
                  <td className="py-2 pr-3 font-medium text-stone-900">
                    {app.link ? (
                      <a
                        href={app.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {app.company}
                      </a>
                    ) : (
                      app.company
                    )}
                  </td>
                  <td className="py-2 pr-3 text-stone-600">{app.role}</td>
                  <td className="py-2 pr-3 whitespace-nowrap text-stone-500">
                    {app.dateApplied}
                  </td>
                  <td className="py-2 pr-3 text-center">
                    {app.referral ? "✅" : ""}
                  </td>
                  <td className="py-2 pr-3">
                    <select
                      value={app.status}
                      onChange={(e) =>
                        startTransition(() =>
                          updateApplicationStatus(app.id, e.target.value)
                        )
                      }
                      className={`cursor-pointer rounded-full border-0 px-2 py-1 text-xs font-medium outline-none ${
                        STATUS_STYLES[app.status as Status] ??
                        "bg-stone-100 text-stone-700"
                      }`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 text-right">
                    <button
                      onClick={() =>
                        startTransition(() => deleteApplication(app.id))
                      }
                      className="text-stone-300 opacity-0 transition hover:text-red-500 group-hover:opacity-100"
                      aria-label="Delete application"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
