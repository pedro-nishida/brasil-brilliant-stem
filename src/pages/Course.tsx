
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, CheckCircle, Lock, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProgress } from '@/hooks/useUserProgress';
import { supabase } from '@/integrations/supabase/client';

interface Lesson {
  id: string;
  titulo: string;
  conteudo_teoria: string;
  ordem: number;
  nivel: string;
  prerequisite_lesson_id: string | null;
  mastery_threshold: number;
  difficulty_level: number;
  is_checkpoint: boolean;
}

interface Course {
  id: string;
  nome: string;
  descricao: string;
  cor: string;
  icone: string;
  lessons: Lesson[];
}

const Course = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { progress } = useUserProgress();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (courseId) {
      fetchCourse();
    }
  }, [courseId, user, navigate]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          lessons(*)
        `)
        .eq('id', courseId)
        .single();

      if (error) throw error;

      if (data) {
        setCourse({
          ...data,
          lessons: data.lessons?.sort((a, b) => a.ordem - b.ordem) || []
        });
      }
    } catch (error) {
      console.error('Erro ao carregar curso:', error);
      navigate('/subjects');
    } finally {
      setLoading(false);
    }
  };

  const getLessonProgress = (lessonId: string) => {
    return progress.find(p => p.lesson_id === lessonId);
  };

  const isLessonUnlocked = (lesson: Lesson) => {
    if (!lesson.prerequisite_lesson_id) return true;
    
    const prerequisiteProgress = getLessonProgress(lesson.prerequisite_lesson_id);
    return prerequisiteProgress?.concluido || false;
  };

  const getCompletedLessons = () => {
    return course?.lessons.filter(lesson => {
      const lessonProgress = getLessonProgress(lesson.id);
      return lessonProgress?.concluido;
    }).length || 0;
  };

  const getCourseProgress = () => {
    if (!course || course.lessons.length === 0) return 0;
    return (getCompletedLessons() / course.lessons.length) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-6 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Curso não encontrado</h1>
          <Button onClick={() => navigate('/subjects')}>
            Voltar aos Estudos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/subjects')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar aos Estudos
        </Button>

        {/* Course Header */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-0">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">{course.nome}</CardTitle>
                <CardDescription className="text-lg">
                  {course.descricao}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Progresso do Curso</span>
                <span className="text-sm text-gray-600">
                  {getCompletedLessons()} de {course.lessons.length} lições
                </span>
              </div>
              <Progress value={getCourseProgress()} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Lessons List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Lições do Curso</h2>
          
          {course.lessons.map((lesson) => {
            const lessonProgress = getLessonProgress(lesson.id);
            const isCompleted = lessonProgress?.concluido || false;
            const isUnlocked = isLessonUnlocked(lesson);
            const masteryScore = lessonProgress?.pontuacao || 0;

            return (
              <Card 
                key={lesson.id}
                className={`transition-all duration-200 hover:shadow-md ${
                  !isUnlocked ? 'opacity-60' : ''
                } ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        {isCompleted ? (
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        ) : isUnlocked ? (
                          <BookOpen className="h-8 w-8 text-blue-600" />
                        ) : (
                          <Lock className="h-8 w-8 text-gray-400" />
                        )}
                        {lesson.is_checkpoint && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{lesson.titulo}</h3>
                          <Badge variant="outline" className="text-xs">
                            Nível {lesson.difficulty_level}
                          </Badge>
                          {lesson.is_checkpoint && (
                            <Badge variant="secondary" className="text-xs">
                              Checkpoint
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-2">
                          {lesson.conteudo_teoria.substring(0, 120)}...
                        </p>
                        
                        {lessonProgress && (
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Pontuação: {masteryScore}%</span>
                            <span>Meta: {lesson.mastery_threshold}%</span>
                            {lessonProgress.tentativas > 0 && (
                              <span>{lessonProgress.tentativas} tentativas</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {isUnlocked && (
                        <Button
                          onClick={() => navigate(`/lesson/${lesson.id}`)}
                          className={isCompleted ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}
                        >
                          {isCompleted ? 'Revisar' : lessonProgress ? 'Continuar' : 'Começar'}
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
    </div>
  );
};

export default Course;
