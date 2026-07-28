# Job Leads — one-time setup

A new **Leads** page finds and collects fresh SWE jobs, and lets you push one
into your Applications with a single click (no re-typing).

## Run these two commands once (on your laptop)

```bash
cd "New Job/Tracker App/job-tracker"
npx prisma migrate dev --name leads   # creates the LeadStatus table + regenerates the client
npm run dev                            # http://localhost:3000
```

Then open the app and click the **briefcase icon** (top-right of the dashboard),
or go to `/leads`.

> The migration is required because I couldn't reach your Supabase DB from here.
> It only adds one small table (`LeadStatus`) — nothing existing is touched.

## How it works

- **Lead content** lives in `data/leads.json` (mirrors how the reading list lives
  in `lib/reading.ts`). The daily task appends here.
- **Lead state** (new / applied / dismissed) lives in the DB in `LeadStatus`
  (mirrors `ReadingProgress`).
- On the Leads page: **Applied ✓** creates a matching row in **Applications**
  automatically and drops the lead off the active list. **Dismiss** hides it.

## The daily finder

A scheduled task, **daily-job-finder**, runs every weekday ~7am ET. It web-searches
for real, currently-open SWE roles (big US cities + remote, $140k+), appends new
ones to `data/leads.json` (auto-deduped), and drops a dated digest in
`daily-digests/` you can read on the train. Manage it in the **Scheduled** sidebar;
hit **Run now** once to pre-approve its tools.

## Notes

- New leads appear instantly in your **local** app. To see them on your
  **phone/Vercel** version too, commit + push `data/leads.json` to redeploy.
  *Applications* always sync to your phone via Supabase the moment you mark one.
- Add leads by hand anytime: `node scripts/add-leads.mjs '[{"company":"X","role":"SWE","url":"https://..."}]'`
