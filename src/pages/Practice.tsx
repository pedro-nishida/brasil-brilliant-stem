
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calculator, Atom, Zap, BookOpen, Target, Timer, Trophy } from 'lucide-react';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/hooks/useCourses';

const Practice = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { courses, loading } = useCourses();
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getSubjectIcon = (iconName: string) => {
    const icons = {
      'Calculator': Calculator,
      'Atom': Atom,
      'Zap': Zap,
      'BookOpen': BookOpen
    };
    return icons[iconName as keyof typeof icons] || BookOpen;
  };

  const practiceTypes = [
    {
      id: 'quick',
      title: 'Prática Rápida',
      description: '5 exercícios aleatórios para revisar conceitos',
      icon: Timer,
      color: 'from-blue-500 to-blue-600',
      duration: '5-10 min'
    },
    {
      id: 'focused',
      title: 'Prática Focada',
      description: 'Exercícios específicos de uma matéria escolhida',
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      duration: '10-15 min'
    },
    {
      id: 'challenge',
      title: 'Desafio Diário',
      description: 'Problemas mais complexos para testar conhecimento',
      icon: Trophy,
      color: 'from-orange-500 to-orange-600',
      duration: '15-25 min'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Área de Prática
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Reforce seus conhecimentos com exercícios direcionados e desafios personalizados
          </p>
        </div>

        {/* Practice Types */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {practiceTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Card key={type.id} className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${type.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{type.title}</CardTitle>
                  <CardDescription className="text-center">
                    {type.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <Badge variant="secondary" className="mb-4">
                    {type.duration}
                  </Badge>
                  <Button 
                    className={`w-full bg-gradient-to-r ${type.color} hover:opacity-90 text-white`}
                    onClick={() => {
                      // Navigate to practice session (to be implemented)
                      console.log(`Starting ${type.id} practice`);
                    }}
                  >
                    Começar Prática
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Subject Selection */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle>Escolha sua Matéria</CardTitle>
            <CardDescription>
              Selecione uma matéria específica para prática focada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {courses.map((course) => {
                const Icon = getSubjectIcon(course.icone);
                const isSelected = selectedSubject === course.id;
                
                return (
                  <div
                    key={course.id}
                    onClick={() => setSelectedSubject(course.id)}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-${course.cor}-500 to-${course.cor}-600 rounded-xl flex items-center justify-center`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold mb-1">{course.nome}</h3>
                      <p className="text-sm text-gray-600">{course.descricao}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {selectedSubject !== 'all' && (
              <div className="mt-6 text-center">
                <Button 
                  onClick={() => {
                    // Navigate to subject-specific practice
                    console.log(`Starting practice for subject: ${selectedSubject}`);
                  }}
                  className="px-8"
                >
                  Praticar {courses.find(c => c.id === selectedSubject)?.nome}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Suas Estatísticas de Prática</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-800">0</div>
                <div className="text-sm text-blue-600">Exercícios Resolvidos</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-800">0%</div>
                <div className="text-sm text-green-600">Taxa de Acerto</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-800">0</div>
                <div className="text-sm text-purple-600">Desafios Concluídos</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-800">0</div>
                <div className="text-sm text-orange-600">Pontos de Prática</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Practice;
