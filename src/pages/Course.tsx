
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Play, Lock, CheckCircle, Star, Clock } from 'lucide-react';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Lesson {
  id: string;
  titulo: string;
  conteudo: string;
  xp_reward: number;
  ordem: number;
  dificuldade: string;
}

interface Course {
  id: string;
  nome: string;
  descricao: string;
  cor: string;
  icone: string;
}

const Course = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchCourseData();
  }, [courseId, user]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);

      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Fetch lessons for this course
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('ordem');

      if (lessonsError) throw lessonsError;
      setLessons(lessonsData || []);

      // Fetch user progress
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user?.id);

      if (progressError) throw progressError;
      setUserProgress(progressData || []);

    } catch (error) {
      console.error('Erro ao carregar dados do curso:', error);
    } finally {
      setLoading(false);
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return userProgress.some(p => p.lesson_id === lessonId && p.concluido);
  };

  const isLessonUnlocked = (lessonIndex: number) => {
    if (lessonIndex === 0) return true;
    const previousLesson = lessons[lessonIndex - 1];
    return isLessonCompleted(previousLesson.id);
  };

  const completedLessons = lessons.filter(lesson => isLessonCompleted(lesson.id)).length;
  const progressPercentage = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0;

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
          <Button onClick={() => navigate('/')}>Voltar ao início</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>

        {/* Course Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br from-${course.cor}-500 to-${course.cor}-600 flex items-center justify-center text-white text-2xl font-bold`}>
                    {course.nome.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-3xl">{course.nome}</CardTitle>
                    <CardDescription className="text-lg">{course.descricao}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{lessons.length} lições</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">Ensino Médio</span>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progresso do Curso</span>
                    <span className="text-sm text-gray-600">{completedLessons}/{lessons.length} concluídas</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Suas Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Lições concluídas:</span>
                  <Badge variant="secondary">{completedLessons}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>XP ganho:</span>
                  <Badge variant="secondary">
                    {lessons.filter(l => isLessonCompleted(l.id)).reduce((total, l) => total + l.xp_reward, 0)} XP
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Progresso:</span>
                  <Badge variant="secondary">{Math.round(progressPercentage)}%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Lessons List */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Lições do Curso</CardTitle>
            <CardDescription>Complete as lições em ordem para desbloquear o próximo conteúdo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lessons.map((lesson, index) => {
                const completed = isLessonCompleted(lesson.id);
                const unlocked = isLessonUnlocked(index);
                
                return (
                  <div
                    key={lesson.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      completed
                        ? 'border-green-200 bg-green-50'
                        : unlocked
                        ? 'border-blue-200 bg-blue-50 hover:border-blue-300 cursor-pointer'
                        : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                    onClick={() => {
                      if (unlocked) {
                        navigate(`/lesson/${lesson.id}`);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          completed
                            ? 'bg-green-100 text-green-600'
                            : unlocked
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {completed ? (
                            <CheckCircle className="h-6 w-6" />
                          ) : unlocked ? (
                            <Play className="h-6 w-6" />
                          ) : (
                            <Lock className="h-6 w-6" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">{lesson.titulo}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {lesson.dificuldade}
                            </Badge>
                            <span className="text-sm text-gray-600">+{lesson.xp_reward} XP</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant={completed ? "outline" : unlocked ? "default" : "ghost"}
                        disabled={!unlocked}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (unlocked) {
                            navigate(`/lesson/${lesson.id}`);
                          }
                        }}
                      >
                        {completed ? "Revisar" : unlocked ? "Começar" : "Bloqueado"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Course;
