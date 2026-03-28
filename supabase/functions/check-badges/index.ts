import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const { userId, streak } = await req.json()
    if (!userId) return new Response(JSON.stringify({ error: 'userId required' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } })

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    const [{ data: badges }, { data: earnedRows }, { data: totalCompletions }] = await Promise.all([
      supabase.from('badges').select('*, criteria:badge_criteria(*)').eq('is_special_challenge', false),
      supabase.from('user_badges').select('badge_id').eq('user_id', userId),
      supabase.rpc('get_user_completion_count', { p_user_id: userId }),
    ])

    const earnedIds = new Set((earnedRows ?? []).map((r: any) => r.badge_id))
    const newlyEarned: { name: string; badgePointValue: number }[] = []

    for (const badge of badges ?? []) {
      if (earnedIds.has(badge.id)) continue
      if (!badge.criteria?.length) continue

      const allMet = badge.criteria.every((c: any) => {
        if (c.criteria_type === 'streak_milestone')   return (streak ?? 0) >= c.target_value
        if (c.criteria_type === 'total_completions')  return (totalCompletions ?? 0) >= c.target_value
        return false
      })
      if (!allMet) continue

      const { error: awardError } = await supabase.from('user_badges').insert({
        user_id: userId, badge_id: badge.id,
        earned_at: new Date().toISOString(),
        earned_context: `streak=${streak}, completions=${totalCompletions}`,
      })

      if (awardError) {
        if (awardError.code === '23505') continue // already earned (race)
        throw awardError
      }

      await supabase.rpc('award_badge_points', { p_user_id: userId, p_points: badge.badge_point_value })
      newlyEarned.push({ name: badge.name, badgePointValue: badge.badge_point_value })
    }

    return new Response(JSON.stringify({ badgesEarned: newlyEarned }), { headers: { ...cors, 'Content-Type': 'application/json' } })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } })
  }
})
