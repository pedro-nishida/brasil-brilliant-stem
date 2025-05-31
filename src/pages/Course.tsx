
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, BookOpen, Clock, Star, Play } from 'lucide-react';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Lesson {
  id: string;
  titulo: string;
  conteudo: string;
  dificuldade: string;
  xp_reward: number;
  ordem: number;
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
  }, [user, courseId, navigate]);

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

      // Fetch lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('ordem');

      if (lessonsError) throw lessonsError;
      setLessons(lessonsData || []);

      // Fetch user progress
      if (user) {
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id);

        if (progressError) throw progressError;
        setUserProgress(progressData || []);
      }

    } catch (error) {
      console.error('Erro ao carregar dados do curso:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLessonProgress = (lessonId: string) => {
    const progress = userProgress.find(p => p.lesson_id === lessonId);
    return progress ? progress.concluido : false;
  };

  const getDifficultyColor = (dificuldade: string) => {
    switch (dificuldade) {
      case 'facil': return 'bg-green-100 text-green-800';
      case 'medio': return 'bg-yellow-100 text-yellow-800';
      case 'dificil': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
          <Button onClick={() => navigate('/')}>Voltar ao Início</Button>
        </div>
      </div>
    );
  }

  const completedLessons = lessons.filter(lesson => getLessonProgress(lesson.id)).length;
  const progressPercentage = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 bg-gradient-to-br from-${course.cor}-500 to-${course.cor}-600 rounded-xl flex items-center justify-center`}>
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{course.nome}</h1>
              <p className="text-gray-600">{course.descricao}</p>
            </div>
          </div>

          {/* Progress Overview */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium">Progresso do Curso</span>
                <span className="text-lg font-bold text-blue-600">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-3 mb-2" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{completedLessons} de {lessons.length} lições concluídas</span>
                <span>{lessons.reduce((sum, lesson) => sum + lesson.xp_reward, 0)} XP total</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lessons List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Lições do Curso</h2>
          
          {lessons.map((lesson, index) => {
            const isCompleted = getLessonProgress(lesson.id);
            const isLocked = index > 0 && !getLessonProgress(lessons[index - 1].id);
            
            return (
              <Card 
                key={lesson.id} 
                className={`transition-all duration-300 ${
                  isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg cursor-pointer'
                } ${isCompleted ? 'border-green-200 bg-green-50/50' : 'bg-white/80 backdrop-blur-sm'}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-500' : isLocked ? 'bg-gray-300' : 'bg-blue-500'
                      }`}>
                        {isCompleted ? (
                          <Star className="h-6 w-6 text-white" />
                        ) : (
                          <span className="text-white font-bold">{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{lesson.titulo}</CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            ~15 min
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            {lesson.xp_reward} XP
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getDifficultyColor(lesson.dificuldade)}>
                        {lesson.dificuldade}
                      </Badge>
                      <Button 
                        disabled={isLocked}
                        onClick={() => !isLocked && navigate(`/lesson/${lesson.id}`)}
                        variant={isCompleted ? "outline" : "default"}
                      >
                        {isLocked ? 'Bloqueado' : isCompleted ? 'Revisar' : 'Iniciar'}
                        {!isLocked && <Play className="ml-2 h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Course;
