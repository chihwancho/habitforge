import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const { userId, points } = await req.json()
    if (!userId || typeof points !== 'number' || points <= 0) {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } })
    }

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const { data: user, error } = await supabase.rpc('deduct_badge_points', { p_user_id: userId, p_points: points }).single()
    if (error) throw error

    return new Response(JSON.stringify({ user }), { headers: { ...cors, 'Content-Type': 'application/json' } })
  } catch (err: any) {
    const status = err.message?.includes('Insufficient') ? 402 : 500
    return new Response(JSON.stringify({ error: err.message }), { status, headers: { ...cors, 'Content-Type': 'application/json' } })
  }
})
