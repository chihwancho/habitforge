# HabitForge

Gamified habit tracker — React web + React Native mobile, powered by Supabase + Drizzle ORM.

## Stack

| Layer | Tech |
|---|---|
| Web | React + Vite |
| Mobile | React Native + Expo Router |
| Shared logic | TypeScript (services, hooks, types) |
| ORM | Drizzle ORM |
| Backend | Supabase (Postgres + Auth + Edge Functions) |
| Monorepo | npm workspaces |

## Getting started

```bash
# 1. Install
npm install

# 2. Add Supabase credentials
cp apps/web/.env.example apps/web/.env
# Fill in all three values:
#   VITE_SUPABASE_URL
#   VITE_SUPABASE_ANON_KEY   (use the sb_publishable_xxx key)
#   VITE_DATABASE_URL        (Supabase transaction pooler URL)

# 3. Run migrations in Supabase SQL editor (in order):
#    supabase/migrations/001_initial_schema.sql
#    supabase/migrations/002_rls_policies.sql
#    supabase/migrations/003_functions.sql

# 4. Add user insert policy (needed for signup)
#    Run in Supabase SQL editor:
#    create policy "users_insert_own" on public.users
#      for insert with check (auth.uid() = id);

# 5. Deploy Edge Functions
supabase link --project-ref your-project-ref
supabase functions deploy add-xp
supabase functions deploy deduct-badge-points
supabase functions deploy check-badges
supabase functions deploy award-badge

# 6. Run apps
npm run web      # http://localhost:5173
npm run mobile   # Expo dev server
```

## Where to find your DATABASE_URL

Supabase Dashboard → Settings → Database → Connection string → Transaction pooler

It looks like:
postgresql://postgres.xxxx:your-password@aws-0-us-west-2.pooler.supabase.com:6543/postgres

## Drizzle commands

```bash
npm run db:push      # push schema changes to database
npm run db:generate  # generate migration files
npm run db:studio    # open Drizzle Studio (DB browser)
```

## Architecture

```
packages/db/          Drizzle schema + client (source of truth for types)
packages/shared/      Services, hooks, repositories (uses @habitforge/db)
apps/web/             React + Vite
apps/mobile/          React Native + Expo Router
supabase/             Edge Functions + SQL migrations
```

## Auth vs Data

- Auth (sign in/up/out) → Supabase JS client
- Data queries → Drizzle ORM via pooler URL
- Atomic mutations (XP, badge points) → Supabase Edge Functions

## Gamification rules

| Difficulty | Base XP | Streak 3d | Streak 7d | Streak 14d | Streak 30d |
|---|---|---|---|---|---|
| Easy | 10 | 15 | 20 | 25 | 30 |
| Medium | 25 | 37 | 50 | 62 | 75 |
| Hard | 50 | 75 | 100 | 125 | 150 |
