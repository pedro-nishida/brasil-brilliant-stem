
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
    const { exerciseId, userAnswer } = await req.json()

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

    // Buscar exercício e resposta correta
    const { data: exercise, error: exerciseError } = await supabaseClient
      .from('exercises')
      .select('*, lessons!inner(*)')
      .eq('id', exerciseId)
      .single()

    if (exerciseError) {
      throw new Error('Exercício não encontrado')
    }

    // Verificar se a resposta está correta
    const isCorrect = exercise.resposta_certa.trim().toLowerCase() === userAnswer.trim().toLowerCase()
    const xpGained = isCorrect ? exercise.lessons.xp_reward : 0

    // Atualizar progresso do usuário na lição
    const { error: progressError } = await supabaseClient
      .from('user_progress')
      .upsert({
        user_id: user.id,
        lesson_id: exercise.lesson_id,
        concluido: isCorrect,
        pontuacao: isCorrect ? 100 : 0,
        data_conclusao: isCorrect ? new Date().toISOString() : null
      })

    if (progressError) {
      throw progressError
    }

    // Atualizar XP do usuário se resposta correta
    if (isCorrect) {
      const { error: xpError } = await supabaseClient
        .from('users_profile')
        .update({ 
          xp: supabaseClient.sql`xp + ${xpGained}` 
        })
        .eq('id', user.id)

      if (xpError) {
        throw xpError
      }

      // Verificar conquistas
      await checkAchievements(supabaseClient, user.id)
    }

    return new Response(
      JSON.stringify({
        correct: isCorrect,
        xpGained,
        explanation: exercise.explicacao
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

async function checkAchievements(supabaseClient: any, userId: string) {
  // Verificar primeira lição
  const { data: firstLesson } = await supabaseClient
    .from('user_progress')
    .select('id')
    .eq('user_id', userId)
    .eq('concluido', true)
    .limit(1)

  if (firstLesson && firstLesson.length === 1) {
    await supabaseClient
      .from('achievements')
      .upsert({
        user_id: userId,
        tipo: 'first_lesson',
        titulo: 'Primeira Lição',
        descricao: 'Complete sua primeira lição',
        xp_bonus: 50
      })
  }

  // Verificar conquistas por matéria (matemática)
  const { data: mathLessons } = await supabaseClient
    .from('user_progress')
    .select('lesson_id, lessons!inner(course_id, courses!inner(nome))')
    .eq('user_id', userId)
    .eq('concluido', true)
    .eq('lessons.courses.nome', 'Matemática')

  if (mathLessons && mathLessons.length >= 10) {
    await supabaseClient
      .from('achievements')
      .upsert({
        user_id: userId,
        tipo: 'math_master',
        titulo: 'Mestre em Matemática',
        descricao: 'Complete 10 lições de matemática',
        xp_bonus: 200
      })
  }
}
