import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const { userId, badgeId, context } = await req.json()
    if (!userId || !badgeId) return new Response(JSON.stringify({ error: 'userId and badgeId required' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } })

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    const { data: badge, error: badgeError } = await supabase
      .from('badges').select('id, name, badge_point_value').eq('id', badgeId).single()
    if (badgeError) throw badgeError

    const { error: awardError } = await supabase.from('user_badges').insert({
      user_id: userId, badge_id: badgeId,
      earned_at: new Date().toISOString(),
      earned_context: context ?? 'manually awarded',
    })

    if (awardError) {
      if (awardError.code === '23505') {
        return new Response(JSON.stringify({ message: 'Already earned', badge }), { headers: { ...cors, 'Content-Type': 'application/json' } })
      }
      throw awardError
    }

    await supabase.rpc('award_badge_points', { p_user_id: userId, p_points: badge.badge_point_value })
    return new Response(JSON.stringify({ awarded: true, badge }), { headers: { ...cors, 'Content-Type': 'application/json' } })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } })
  }
})
