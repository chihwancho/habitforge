-- ============================================================
-- HabitForge — Database Functions
-- Atomic operations called by Edge Functions via RPC.
-- security definer = runs as owner, bypasses RLS safely.
-- ============================================================

create or replace function public.xp_for_level(p_level integer)
returns integer language sql immutable as $$
  select p_level * 100;
$$;

create or replace function public.level_from_xp(p_total_xp integer)
returns integer language plpgsql immutable as $$
declare
  v_level   integer := 1;
  v_xp_used integer := 0;
begin
  loop
    exit when v_xp_used + public.xp_for_level(v_level) > p_total_xp;
    v_xp_used := v_xp_used + public.xp_for_level(v_level);
    v_level   := v_level + 1;
  end loop;
  return v_level;
end;
$$;

-- Atomically adds XP and recalculates level. Uses FOR UPDATE to prevent race conditions.
create or replace function public.add_xp(p_user_id uuid, p_xp integer)
returns public.users language plpgsql security definer as $$
declare
  v_user      public.users;
  v_new_xp    integer;
  v_new_level integer;
begin
  select * into v_user from public.users where id = p_user_id for update;
  if not found then raise exception 'User % not found', p_user_id; end if;

  v_new_xp    := v_user.total_xp + p_xp;
  v_new_level := public.level_from_xp(v_new_xp);

  update public.users set total_xp = v_new_xp, level = v_new_level
  where id = p_user_id returning * into v_user;

  return v_user;
end;
$$;

-- Atomically deducts badge points. Guards against overdraft.
create or replace function public.deduct_badge_points(p_user_id uuid, p_points integer)
returns public.users language plpgsql security definer as $$
declare
  v_user public.users;
begin
  select * into v_user from public.users where id = p_user_id for update;
  if not found then raise exception 'User % not found', p_user_id; end if;
  if v_user.badge_points < p_points then
    raise exception 'Insufficient badge points. Has %, needs %', v_user.badge_points, p_points;
  end if;

  update public.users set badge_points = badge_points - p_points
  where id = p_user_id returning * into v_user;

  return v_user;
end;
$$;

-- Adds badge points when a badge is awarded.
create or replace function public.award_badge_points(p_user_id uuid, p_points integer)
returns void language plpgsql security definer as $$
begin
  update public.users set badge_points = badge_points + p_points where id = p_user_id;
end;
$$;

-- Total habit completions for a user — used for badge criteria.
create or replace function public.get_user_completion_count(p_user_id uuid)
returns integer language sql security definer as $$
  select count(*)::integer from public.habit_logs where user_id = p_user_id;
$$;
