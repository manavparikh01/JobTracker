# Job Tracker

A one-glance dashboard for the job hunt. Built to be opened, scanned, and acted on in ~10 seconds — the opposite of a spreadsheet you forget to update.

Three things, one screen:

- **Today's focus** — surfaces what your 3-month plan says to do *today* (Tue = learn, Wed = apply, Thu = network, Mon/Fri = LeetCode, weekend = deep block).
- **Daily tasks** — a checklist scoped to today. Add, check off, delete.
- **Applications** — company / role / date / referral / status, plus a tiny stats strip (count, live pipelines, response rate, LeetCode solved).

## Stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS v4**
- **Prisma 7** with the node-postgres driver adapter
- **Supabase** (Postgres) — one database for laptop + phone
- Server Actions for all mutations (no separate API layer)
- Deploys to **Vercel**

---

## One-time setup

### 1. Create the Supabase database

1. Make a project at [supabase.com](https://supabase.com) (free tier is plenty).
2. Click **Connect** (top bar) → **ORMs** / connection string. You need two:
   - **Transaction pooler** (port `6543`) → `DATABASE_URL`
   - **Session pooler** or **Direct connection** (port `5432`) → `DIRECT_URL`
3. Copy `.env.example` to `.env` and paste both, filling in your password:

   ```bash
   cp .env.example .env
   ```

   ```
   DATABASE_URL="postgresql://postgres.<ref>:<pwd>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.<ref>:<pwd>@aws-0-<region>.pooler.supabase.com:5432/postgres"
   ```

### 2. Create the tables

```bash
npm install                       # also runs `prisma generate`
npx prisma migrate dev --name init   # creates the tables in Supabase
```

### 3. Run it

```bash
npm run dev        # http://localhost:3000
```

Useful extras:

```bash
npx prisma studio  # browse/edit your data in a GUI
```

---

## Deploy to Vercel

1. Push this folder to a GitHub repo (see below).
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Add **both** environment variables (`DATABASE_URL` and `DIRECT_URL`) — same
   values as your `.env`.
4. Deploy. The `build` script runs `prisma generate` automatically.

Open the Vercel URL on your phone and **Add to Home Screen** — now it's the
tracker you actually check on the train. Because everything lives in Supabase,
laptop and phone see the same data instantly.

### Pushing to GitHub

```bash
git add -A
git commit -m "Job tracker on Supabase"
gh repo create job-tracker --private --source=. --push   # or create on github.com and `git push`
```

---

## Data model

`prisma/schema.prisma` — three models:

- `Application` — company, role, dateApplied, referral, status (`applied → screen → onsite → offer/rejected`), link, notes
- `Todo` — text, done, `day` (a `YYYY-MM-DD` string so each day's list is easy to query)
- `Counter` — named integers (currently just `leetcode`)

The weekly focus mapping lives in `lib/plan.ts`. The Prisma client connects via
a driver adapter in `lib/db.ts`: the app uses the pooled `DATABASE_URL` at
runtime, while migrations use the direct `DIRECT_URL` (configured in
`prisma.config.ts`).

> **Note:** `.env` and the generated Prisma client (`/generated`) are gitignored.
> The client is regenerated on install/build, so a fresh clone just works.
>
> **Troubleshooting:** if you ever see a "prepared statement already exists"
> error from the pooler, point `DATABASE_URL` at the **Session pooler** (port
> `5432`) instead of the transaction pooler.
