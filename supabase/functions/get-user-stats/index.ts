
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Get user from JWT token
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    // Buscar estatísticas do usuário
    const [profileResult, progressResult, achievementsResult, streakResult] = await Promise.all([
      supabaseClient
        .from('users_profile')
        .select('*')
        .eq('id', user.id)
        .single(),
      
      supabaseClient
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id),
      
      supabaseClient
        .from('achievements')
        .select('*')
        .eq('user_id', user.id),
      
      supabaseClient
        .from('streaks')
        .select('*')
        .eq('user_id', user.id)
        .single()
    ])

    const profile = profileResult.data
    const progress = progressResult.data || []
    const achievements = achievementsResult.data || []
    const streak = streakResult.data

    // Calcular estatísticas
    const completedLessons = progress.filter(p => p.concluido).length
    const totalLessons = await getTotalLessons(supabaseClient)
    const completionRate = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    // Calcular XP total (incluindo bônus de conquistas)
    const achievementXP = achievements.reduce((sum, ach) => sum + (ach.xp_bonus || 0), 0)
    const totalXP = (profile?.xp || 0) + achievementXP

    return new Response(
      JSON.stringify({
        profile,
        stats: {
          completedLessons,
          totalLessons,
          completionRate,
          totalXP,
          currentStreak: streak?.dias_consecutivos || 0,
          maxStreak: streak?.maior_streak || 0,
          achievements: achievements.length
        },
        achievements,
        progress
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

async function getTotalLessons(supabaseClient: any) {
  const { count } = await supabaseClient
    .from('lessons')
    .select('*', { count: 'exact', head: true })
  
  return count || 0
}
