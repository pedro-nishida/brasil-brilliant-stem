
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, BookOpen, Target, Brain, GraduationCap } from 'lucide-react';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { LearningPath } from '@/components/kumon/LearningPath';
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

const Subjects = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'courses' | 'kumon'>('kumon');
  const [selectedCategory, setSelectedCategory] = useState<string>('matematica');

  const categories = [
    { id: 'matematica', name: 'Matemática', icon: Calculator, color: 'from-blue-500 to-blue-600' },
    { id: 'fisica', name: 'Física', icon: Target, color: 'from-green-500 to-green-600' },
    { id: 'quimica', name: 'Química', icon: Brain, color: 'from-purple-500 to-purple-600' },
    { id: 'biologia', name: 'Biologia', icon: BookOpen, color: 'from-orange-500 to-orange-600' }
  ];

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

      // Fetch courses with lesson counts
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select(`
          *,
          lessons!inner(id, course_id)
        `)
        .order('ordem');

      if (coursesError) throw coursesError;

      const processedCourses = coursesData?.map(course => ({
        ...course,
        lesson_count: course.lessons?.length || 0,
        completed_lessons: 0
      })) || [];

      setCourses(processedCourses);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
            Método Kumon: Progressão linear focada no domínio de cada conceito
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <Button
              variant={activeTab === 'kumon' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('kumon')}
              className="mr-2"
            >
              <Target className="h-4 w-4 mr-2" />
              Caminho Linear
            </Button>
            <Button
              variant={activeTab === 'courses' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('courses')}
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              Cursos
            </Button>
          </div>
        </div>

        {/* Kumon-Style Learning Path */}
        {activeTab === 'kumon' && (
          <div className="space-y-6">
            {/* Category Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`h-20 flex-col space-y-2 ${
                      selectedCategory === category.id 
                        ? `bg-gradient-to-r ${category.color} text-white` 
                        : ''
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-sm font-medium">{category.name}</span>
                  </Button>
                );
              })}
            </div>

            {/* Learning Path */}
            <LearningPath categoria={selectedCategory} />
          </div>
        )}

        {/* Traditional Courses Tab */}
        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
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
      </div>
    </div>
  );
};

export default Subjects;
