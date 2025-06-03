
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Lock, Star, BookOpen, Target, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface LessonNode {
  id: string;
  titulo: string;
  categoria: string;
  nivel: string;
  ordem: number;
  prerequisite_lesson_id: string | null;
  mastery_threshold: number;
  difficulty_level: number;
  is_checkpoint: boolean;
  worksheet_count: number;
  user_progress?: {
    mastery_score: number;
    is_unlocked: boolean;
    consecutive_correct: number;
    attempt_count: number;
  };
}

export const LearningPath = ({ categoria }: { categoria: string }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lessons, setLessons] = useState<LessonNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  useEffect(() => {
    if (user) {
      fetchLearningPath();
    }
  }, [user, categoria]);

  const fetchLearningPath = async () => {
    try {
      setLoading(true);
      
      // Fetch lessons for the category
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('categoria', categoria)
        .order('ordem');

      if (lessonsError) throw lessonsError;

      // Fetch user progress
      let progressData = [];
      if (user) {
        const { data, error: progressError } = await supabase
          .from('user_progress')
          .select('lesson_id, mastery_score, is_unlocked, consecutive_correct, attempt_count')
          .eq('user_id', user.id);

        if (!progressError) {
          progressData = data || [];
        }
      }

      // Combine data
      const lessonsWithProgress = lessonsData?.map(lesson => {
        const progress = progressData.find(p => p.lesson_id === lesson.id);
        return {
          ...lesson,
          user_progress: progress ? {
            mastery_score: progress.mastery_score || 0,
            is_unlocked: progress.is_unlocked || false,
            consecutive_correct: progress.consecutive_correct || 0,
            attempt_count: progress.attempt_count || 0
          } : undefined
        };
      }) || [];

      setLessons(lessonsWithProgress);

      // Find current lesson (first non-mastered lesson)
      const currentIndex = lessonsWithProgress.findIndex(lesson => 
        !lesson.user_progress || lesson.user_progress.mastery_score < lesson.mastery_threshold
      );
      setCurrentLessonIndex(currentIndex >= 0 ? currentIndex : lessonsWithProgress.length - 1);

    } catch (error) {
      console.error('Erro ao carregar caminho de aprendizado:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLessonStatus = (lesson: LessonNode, index: number) => {
    if (!lesson.user_progress) {
      return index === 0 ? 'unlocked' : 'locked';
    }

    const { mastery_score, is_unlocked } = lesson.user_progress;
    
    if (mastery_score >= lesson.mastery_threshold) {
      return 'mastered';
    } else if (is_unlocked || index === 0) {
      return 'unlocked';
    } else {
      return 'locked';
    }
  };

  const getStatusIcon = (status: string, lesson: LessonNode) => {
    switch (status) {
      case 'mastered':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'unlocked':
        return lesson.is_checkpoint ? 
          <Target className="h-6 w-6 text-blue-600" /> : 
          <BookOpen className="h-6 w-6 text-blue-600" />;
      default:
        return <Lock className="h-6 w-6 text-gray-400" />;
    }
  };

  const getProgressPercentage = (lesson: LessonNode) => {
    if (!lesson.user_progress) return 0;
    return Math.min(100, (lesson.user_progress.mastery_score / lesson.mastery_threshold) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Caminho de Aprendizado - {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <p className="text-gray-600">
              Lição {currentLessonIndex + 1} de {lessons.length}
            </p>
            <Progress 
              value={(currentLessonIndex / lessons.length) * 100} 
              className="h-3"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lesson Path */}
      <div className="space-y-4">
        {lessons.map((lesson, index) => {
          const status = getLessonStatus(lesson, index);
          const progressPercent = getProgressPercentage(lesson);
          const isCurrent = index === currentLessonIndex;
          
          return (
            <Card 
              key={lesson.id} 
              className={`transition-all duration-200 ${
                isCurrent ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
              } ${status === 'locked' ? 'opacity-60' : ''}`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`relative ${lesson.is_checkpoint ? 'scale-110' : ''}`}>
                      {getStatusIcon(status, lesson)}
                      {lesson.is_checkpoint && (
                        <Star className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500 fill-current" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{lesson.titulo}</h3>
                        {lesson.is_checkpoint && (
                          <Badge variant="secondary" className="text-xs">
                            Checkpoint
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          Nível {lesson.difficulty_level}
                        </Badge>
                      </div>
                      
                      {lesson.user_progress && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>Progresso: {lesson.user_progress.mastery_score}%</span>
                            <span>•</span>
                            <span>{lesson.user_progress.attempt_count} tentativas</span>
                            <span>•</span>
                            <span>{lesson.user_progress.consecutive_correct} consecutivos</span>
                          </div>
                          <Progress value={progressPercent} className="h-2" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {status === 'unlocked' && (
                      <Button
                        onClick={() => navigate(`/lesson/${lesson.id}`)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {lesson.user_progress ? 'Continuar' : 'Começar'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                    
                    {status === 'mastered' && (
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/lesson/${lesson.id}`)}
                      >
                        Revisar
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
