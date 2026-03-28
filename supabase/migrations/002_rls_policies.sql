-- ============================================================
-- HabitForge — Row Level Security Policies
-- ============================================================

alter table public.users              enable row level security;
alter table public.habits             enable row level security;
alter table public.habit_logs         enable row level security;
alter table public.user_badges        enable row level security;
alter table public.rewards            enable row level security;
alter table public.reward_redemptions enable row level security;
alter table public.themes             enable row level security;
alter table public.badges             enable row level security;
alter table public.badge_criteria     enable row level security;

-- Users
create policy "users_select_own" on public.users for select using (auth.uid() = id);
create policy "users_update_own" on public.users for update using (auth.uid() = id) with check (auth.uid() = id);

-- Habits
create policy "habits_select_own" on public.habits for select using (auth.uid() = user_id);
create policy "habits_insert_own" on public.habits for insert with check (auth.uid() = user_id);
create policy "habits_update_own" on public.habits for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "habits_delete_own" on public.habits for delete using (auth.uid() = user_id);

-- Habit logs
create policy "logs_select_own" on public.habit_logs for select using (auth.uid() = user_id);
create policy "logs_insert_own" on public.habit_logs for insert with check (auth.uid() = user_id);

-- Badges (public read)
create policy "badges_public_read"    on public.badges         for select using (true);
create policy "criteria_public_read"  on public.badge_criteria for select using (true);

-- User badges
create policy "user_badges_select_own" on public.user_badges for select using (auth.uid() = user_id);

-- Rewards
create policy "rewards_select_own" on public.rewards for select using (auth.uid() = user_id);
create policy "rewards_insert_own" on public.rewards for insert with check (auth.uid() = user_id);
create policy "rewards_update_own" on public.rewards for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "rewards_delete_own" on public.rewards for delete using (auth.uid() = user_id);

-- Reward redemptions
create policy "redemptions_select_own" on public.reward_redemptions for select using (auth.uid() = user_id);

-- Themes (public read)
create policy "themes_public_read" on public.themes for select using (true);
