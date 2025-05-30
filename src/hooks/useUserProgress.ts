
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  concluido: boolean;
  pontuacao: number;
  tentativas: number;
  data_conclusao?: string;
  created_at: string;
}

export const useUserProgress = () => {
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProgress();
    } else {
      setProgress([]);
      setLoading(false);
    }
  }, [user]);

  const fetchProgress = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao buscar progresso:', error);
        setError(error.message);
      } else {
        setProgress(data || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (lessonId: string, completed: boolean, score: number = 0) => {
    if (!user) return { error: 'Usuário não autenticado' };

    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          concluido: completed,
          pontuacao: score,
          data_conclusao: completed ? new Date().toISOString() : null
        });

      if (error) {
        console.error('Erro ao atualizar progresso:', error);
        return { error: error.message };
      }

      // Recarregar dados
      await fetchProgress();
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  return {
    progress,
    loading,
    error,
    fetchProgress,
    updateProgress
  };
};
