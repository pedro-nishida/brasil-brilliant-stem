
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface IncorrectAnswer {
  id: string;
  exercise_id: string;
  user_answer: string;
  correct_answer: string;
  created_at: string;
  exercise: {
    id: string;
    enunciado: string;
    tipo: string;
    dificuldade: string;
    explicacao: string;
    lesson: {
      titulo: string;
      course: {
        nome: string;
      };
    };
  };
}

interface FilterOptions {
  subject: string;
  topic: string;
  difficulty: string;
}

export const useIncorrectAnswers = () => {
  const { user } = useAuth();
  const [incorrectAnswers, setIncorrectAnswers] = useState<IncorrectAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    subject: 'all',
    topic: 'all',
    difficulty: 'all'
  });

  useEffect(() => {
    if (user) {
      fetchIncorrectAnswers();
    }
  }, [user, filters]);

  const fetchIncorrectAnswers = async () => {
    try {
      setLoading(true);
      
      // For now, we'll simulate incorrect answers since we don't have a specific table
      // In a real implementation, you'd track wrong answers in user_progress or a dedicated table
      const { data: progressData, error } = await supabase
        .from('user_progress')
        .select(`
          *,
          lessons!inner(
            titulo,
            courses!inner(nome)
          )
        `)
        .eq('user_id', user!.id)
        .lt('pontuacao', 60); // Consider < 60% as needing review

      if (error) throw error;

      // Transform the data to match our interface
      const simulatedIncorrectAnswers = (progressData || []).map((progress, index) => ({
        id: progress.id,
        exercise_id: `exercise_${index}`,
        user_answer: 'Resposta incorreta',
        correct_answer: 'Resposta correta',
        created_at: progress.created_at,
        exercise: {
          id: `exercise_${index}`,
          enunciado: `Exercício de ${progress.lessons.titulo}`,
          tipo: 'multiple_choice',
          dificuldade: 'medio',
          explicacao: `Este exercício de ${progress.lessons.titulo} precisa ser revisado.`,
          lesson: {
            titulo: progress.lessons.titulo,
            course: {
              nome: progress.lessons.courses.nome
            }
          }
        }
      }));

      // Apply filters
      let filtered = simulatedIncorrectAnswers;
      
      if (filters.subject !== 'all') {
        filtered = filtered.filter(item => 
          item.exercise.lesson.course.nome.toLowerCase() === filters.subject.toLowerCase()
        );
      }

      if (filters.difficulty !== 'all') {
        filtered = filtered.filter(item => 
          item.exercise.dificuldade === filters.difficulty
        );
      }

      setIncorrectAnswers(filtered);
    } catch (error) {
      console.error('Erro ao buscar respostas incorretas:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      subject: 'all',
      topic: 'all',
      difficulty: 'all'
    });
  };

  return {
    incorrectAnswers,
    loading,
    filters,
    updateFilters,
    resetFilters,
    refetch: fetchIncorrectAnswers
  };
};
