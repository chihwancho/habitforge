-- ============================================================
-- HabitForge — Initial Schema
-- Run in Supabase SQL editor in order (001, 002, 003)
-- ============================================================

create extension if not exists "uuid-ossp";

-- ─── Users ───────────────────────────────────────────────────────────────────

create table public.users (
  id            uuid primary key references auth.users(id) on delete cascade,
  username      text not null unique,
  email         text not null unique,
  total_xp      integer not null default 0,
  level         integer not null default 1,
  badge_points  integer not null default 0,
  avatar_url    text,
  theme_id      uuid,
  created_at    timestamptz not null default now()
);

-- ─── Themes ──────────────────────────────────────────────────────────────────

create table public.themes (
  id                uuid primary key default uuid_generate_v4(),
  name              text not null unique,
  primary_color     text not null,
  accent_color      text not null,
  background_style  text not null,
  is_default        boolean not null default false
);

insert into public.themes (name, primary_color, accent_color, background_style, is_default) values
  ('Dark',     '#0f0f11', '#7c6dfa', 'solid', true),
  ('Midnight', '#090912', '#5b4dd4', 'solid', false),
  ('Forest',   '#0d1410', '#3ecf8e', 'solid', false);

alter table public.users
  add constraint fk_users_theme
  foreign key (theme_id) references public.themes(id) on delete set null;

-- ─── Habits ──────────────────────────────────────────────────────────────────

create table public.habits (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.users(id) on delete cascade,
  name            text not null,
  description     text,
  frequency_type  text not null default 'daily' check (frequency_type in ('daily','weekly','custom','one-time')),
  frequency_value integer not null default 1,
  scheduled_days  text[] not null default '{}',
  difficulty_tier integer not null default 1 check (difficulty_tier between 1 and 3),
  base_xp         integer not null default 10,
  is_active       boolean not null default true,
  is_archived     boolean not null default false,
  current_streak  integer not null default 0,
  longest_streak  integer not null default 0,
  start_date      timestamptz not null default now(),
  end_date        timestamptz,
  created_at      timestamptz not null default now()
);

create index idx_habits_user_active on public.habits(user_id, is_active, is_archived);

-- ─── Habit Logs ──────────────────────────────────────────────────────────────

create table public.habit_logs (
  id                uuid primary key default uuid_generate_v4(),
  habit_id          uuid not null references public.habits(id) on delete cascade,
  user_id           uuid not null references public.users(id) on delete cascade,
  completed_at      timestamptz not null default now(),
  xp_earned         integer not null default 0,
  streak_multiplier numeric(4,2) not null default 1.0,
  note              text
);

create index idx_habit_logs_habit    on public.habit_logs(habit_id);
create index idx_habit_logs_user     on public.habit_logs(user_id);
create index idx_habit_logs_date     on public.habit_logs(user_id, completed_at desc);

-- ─── Badges ──────────────────────────────────────────────────────────────────

create table public.badges (
  id                   uuid primary key default uuid_generate_v4(),
  name                 text not null unique,
  description          text not null,
  icon_url             text,
  badge_type           text not null check (badge_type in ('streak','completions','challenge')),
  badge_point_value    integer not null default 5,
  is_special_challenge boolean not null default false,
  created_at           timestamptz not null default now()
);

create table public.badge_criteria (
  id            uuid primary key default uuid_generate_v4(),
  badge_id      uuid not null references public.badges(id) on delete cascade,
  criteria_type text not null check (criteria_type in ('streak_milestone','total_completions','special_challenge')),
  target_value  integer not null,
  habit_id      uuid references public.habits(id) on delete set null
);

create table public.user_badges (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references public.users(id) on delete cascade,
  badge_id       uuid not null references public.badges(id) on delete cascade,
  earned_at      timestamptz not null default now(),
  earned_context text,
  unique (user_id, badge_id)
);

create index idx_user_badges_user on public.user_badges(user_id);

-- Seed badges
insert into public.badges (name, description, badge_type, badge_point_value, is_special_challenge) values
  ('First Step',      'Complete your first habit',              'completions', 5,  false),
  ('Hat Trick',       'Complete a habit 3 days in a row',       'streak',      10, false),
  ('Week Warrior',    'Maintain a 7-day streak',                'streak',      20, false),
  ('Fortnight',       'Maintain a 14-day streak',               'streak',      35, false),
  ('Month Master',    'Maintain a 30-day streak',               'streak',      60, false),
  ('Centurion',       'Complete any habit 100 times',           'completions', 50, false),
  ('Hard Hitter',     'Complete a hard habit 10 times',         'completions', 25, false),
  ('Overachiever',    'Complete 5 different habits in one day', 'challenge',   30, true);

insert into public.badge_criteria (badge_id, criteria_type, target_value)
  select id, 'total_completions', 1   from public.badges where name = 'First Step';
insert into public.badge_criteria (badge_id, criteria_type, target_value)
  select id, 'streak_milestone',  3   from public.badges where name = 'Hat Trick';
insert into public.badge_criteria (badge_id, criteria_type, target_value)
  select id, 'streak_milestone',  7   from public.badges where name = 'Week Warrior';
insert into public.badge_criteria (badge_id, criteria_type, target_value)
  select id, 'streak_milestone',  14  from public.badges where name = 'Fortnight';
insert into public.badge_criteria (badge_id, criteria_type, target_value)
  select id, 'streak_milestone',  30  from public.badges where name = 'Month Master';
insert into public.badge_criteria (badge_id, criteria_type, target_value)
  select id, 'total_completions', 100 from public.badges where name = 'Centurion';

-- ─── Rewards ─────────────────────────────────────────────────────────────────

create table public.rewards (
  id                 uuid primary key default uuid_generate_v4(),
  user_id            uuid not null references public.users(id) on delete cascade,
  name               text not null,
  description        text,
  badge_point_cost   integer not null default 10 check (badge_point_cost > 0),
  reward_type        text not null default 'custom' check (reward_type in ('custom','cosmetic')),
  cosmetic_asset_url text,
  is_active          boolean not null default true,
  created_at         timestamptz not null default now()
);

create index idx_rewards_user on public.rewards(user_id);

create table public.reward_redemptions (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.users(id) on delete cascade,
  reward_id    uuid not null references public.rewards(id) on delete cascade,
  redeemed_at  timestamptz not null default now(),
  points_spent integer not null
);

create index idx_redemptions_user on public.reward_redemptions(user_id);
