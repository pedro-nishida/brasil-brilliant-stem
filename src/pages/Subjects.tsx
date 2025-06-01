
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calculator, BookOpen, Target, Brain, GraduationCap } from 'lucide-react';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Course {
  id: string;
  nome: string;
  descricao: string;
  cor: string;
  icone: string;
  ordem: number;
  lesson_count: number;
  completed_lessons: number;
}

interface Subject {
  id: string;
  titulo: string;
  conteudo_teoria: string;
  categoria: string;
  nivel: string;
  icone: string;
  cor: string;
  ordem: number;
  exercise_count: number;
  user_progress?: {
    acertos: number;
    tentativas: number;
    tempo_estudo: number;
    concluido: boolean;
  };
}

const Subjects = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'courses' | 'subjects'>('courses');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select(`
          *,
          lessons!inner(id, course_id)
        `)
        .order('ordem');

      if (coursesError) throw coursesError;

      // Process courses with lesson counts
      const processedCourses = coursesData?.map(course => ({
        ...course,
        lesson_count: course.lessons?.length || 0,
        completed_lessons: 0 // Will be calculated with user progress
      })) || [];

      setCourses(processedCourses);

      // Fetch standalone subjects (lessons without course_id)
      const { data: subjectsData, error: subjectsError } = await supabase
        .from('lessons')
        .select(`
          *,
          exercises!inner(id, lesson_id)
        `)
        .is('course_id', null)
        .order('categoria, ordem');

      if (subjectsError) throw subjectsError;

      // Process subjects with exercise counts
      const processedSubjects = subjectsData?.map(subject => ({
        ...subject,
        exercise_count: subject.exercises?.length || 0
      })) || [];

      // Fetch user progress for subjects
      if (user) {
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('lesson_id, acertos, tentativas, tempo_estudo, concluido')
          .eq('user_id', user.id);

        if (!progressError && progressData) {
          const subjectsWithProgress = processedSubjects.map(subject => {
            const progress = progressData.find(p => p.lesson_id === subject.id);
            return {
              ...subject,
              user_progress: progress ? {
                acertos: progress.acertos || 0,
                tentativas: progress.tentativas || 0,
                tempo_estudo: progress.tempo_estudo || 0,
                concluido: progress.concluido || false
              } : undefined
            };
          });
          setSubjects(subjectsWithProgress);
        } else {
          setSubjects(processedSubjects);
        }
      } else {
        setSubjects(processedSubjects);
      }

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSubjectsByCategory = () => {
    const categories = subjects.reduce((acc, subject) => {
      if (!acc[subject.categoria]) {
        acc[subject.categoria] = [];
      }
      acc[subject.categoria].push(subject);
      return acc;
    }, {} as Record<string, Subject[]>);

    return categories;
  };

  const getCategoryIcon = (categoria: string) => {
    switch (categoria) {
      case 'matematica': return Calculator;
      case 'fisica': return Target;
      case 'quimica': return Brain;
      case 'biologia': return BookOpen;
      default: return GraduationCap;
    }
  };

  const getCategoryName = (categoria: string) => {
    switch (categoria) {
      case 'matematica': return 'Matemática';
      case 'fisica': return 'Física';
      case 'quimica': return 'Química';
      case 'biologia': return 'Biologia';
      default: return categoria.charAt(0).toUpperCase() + categoria.slice(1);
    }
  };

  const getLevelColor = (nivel: string) => {
    switch (nivel) {
      case 'fundamental': return 'from-green-500 to-green-600';
      case 'medio': return 'from-blue-500 to-blue-600';
      case 'intermediario': return 'from-blue-500 to-blue-600';
      case 'avancado': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const categorizedSubjects = getSubjectsByCategory();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Estudos
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Escolha entre cursos estruturados ou tópicos independentes para estudar
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <Button
              variant={activeTab === 'courses' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('courses')}
              className="mr-2"
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              Cursos
            </Button>
            <Button
              variant={activeTab === 'subjects' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('subjects')}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Tópicos
            </Button>
          </div>
        </div>

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getLevelColor('medio')} rounded-xl flex items-center justify-center`}>
                      <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="secondary">
                      {course.lesson_count} lições
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{course.nome}</CardTitle>
                  <CardDescription className="text-sm">
                    {course.descricao}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full"
                    onClick={() => navigate(`/course/${course.id}`)}
                  >
                    Iniciar Curso
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Subjects Tab */}
        {activeTab === 'subjects' && (
          <div className="space-y-8">
            {Object.entries(categorizedSubjects).map(([categoria, subjects]) => {
              const Icon = getCategoryIcon(categoria);
              
              return (
                <div key={categoria}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 bg-gradient-to-br ${getLevelColor('medio')} rounded-lg flex items-center justify-center`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {getCategoryName(categoria)}
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.map((subject) => {
                      const progress = subject.user_progress;
                      const progressPercentage = progress && progress.tentativas > 0
                        ? Math.round((progress.acertos / progress.tentativas) * 100)
                        : 0;
                      
                      return (
                        <Card key={subject.id} className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-0 bg-white/80 backdrop-blur-sm">
                          <CardHeader>
                            <div className="flex items-center justify-between mb-4">
                              <div className={`w-12 h-12 bg-gradient-to-br ${getLevelColor(subject.nivel)} rounded-xl flex items-center justify-center`}>
                                <Icon className="h-6 w-6 text-white" />
                              </div>
                              <Badge variant="secondary">
                                {subject.nivel}
                              </Badge>
                            </div>
                            <CardTitle className="text-xl">{subject.titulo}</CardTitle>
                            <CardDescription className="text-sm">
                              {subject.conteudo_teoria.substring(0, 100)}...
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {progress && (
                              <div>
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium">Progresso</span>
                                  <span className="text-sm text-gray-600">{progressPercentage}%</span>
                                </div>
                                <Progress value={progressPercentage} className="h-2" />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>{progress.acertos} acertos</span>
                                  <span>{progress.tempo_estudo}min estudados</span>
                                </div>
                              </div>
                            )}
                            
                            <Button 
                              className={`w-full bg-gradient-to-r ${getLevelColor(subject.nivel)} hover:opacity-90 text-white`}
                              onClick={() => navigate(`/lesson/${subject.id}`)}
                            >
                              {progress ? 'Continuar Estudos' : 'Começar Tópico'}
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Subjects;
