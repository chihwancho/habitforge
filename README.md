# HabitForge

Gamified habit tracker — React web + React Native mobile, powered by Supabase.

## Stack

| Layer | Tech |
|---|---|
| Web | React + Vite |
| Mobile | React Native + Expo Router |
| Shared logic | TypeScript (services, hooks, types) |
| Backend | Supabase (Postgres + Auth + Edge Functions) |
| Monorepo | npm workspaces |

## Getting started

```bash
# 1. Install
npm install

# 2. Add Supabase credentials
cp apps/web/.env.example apps/web/.env

# 3. Run migrations in Supabase SQL editor (in order):
#    supabase/migrations/001_initial_schema.sql
#    supabase/migrations/002_rls_policies.sql
#    supabase/migrations/003_functions.sql

# 4. Deploy Edge Functions
supabase link --project-ref your-project-ref
supabase functions deploy add-xp
supabase functions deploy deduct-badge-points
supabase functions deploy check-badges
supabase functions deploy award-badge

# 5. Run apps
npm run web      # http://localhost:5173
npm run mobile   # Expo dev server
```

## Gamification rules

| Difficulty | Base XP | Streak 3d | Streak 7d | Streak 14d | Streak 30d |
|---|---|---|---|---|---|
| Easy | 10 | 15 | 20 | 25 | 30 |
| Medium | 25 | 37 | 50 | 62 | 75 |
| Hard | 50 | 75 | 100 | 125 | 150 |

## Migration away from Supabase

1. Replace `packages/shared/src/providers/supabaseProvider.ts` with an `httpProvider.ts`
2. Update repositories to use the new provider
3. All services, hooks, and UI components stay unchanged
