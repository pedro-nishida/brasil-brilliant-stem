
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, Target, BookOpen, TrendingUp, Award, FileText, CheckCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';

const Enem = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  const subjects = [
    { name: "Matemática", progress: 65, total: 45, completed: 29, color: "blue" },
    { name: "Linguagens", progress: 45, total: 40, completed: 18, color: "green" },
    { name: "Ciências Humanas", progress: 30, total: 45, completed: 14, color: "purple" },
    { name: "Ciências da Natureza", progress: 55, total: 45, completed: 25, color: "orange" },
    { name: "Redação", progress: 20, total: 10, completed: 2, color: "red" }
  ];

  const simulados = [
    {
      id: 1,
      title: "Simulado ENEM 2024 - 1º Dia",
      description: "Linguagens e Ciências Humanas + Redação",
      duration: "5h30min",
      questions: 90,
      status: "available",
      difficulty: "Médio"
    },
    {
      id: 2,
      title: "Simulado ENEM 2024 - 2º Dia", 
      description: "Matemática e Ciências da Natureza",
      duration: "5h",
      questions: 90,
      status: "locked",
      difficulty: "Difícil"
    },
    {
      id: 3,
      title: "Simulado Matemática Focado",
      description: "Apenas questões de Matemática",
      duration: "3h",
      questions: 45,
      status: "completed",
      difficulty: "Médio",
      score: 78
    }
  ];

  const tips = [
    {
      category: "Estratégia",
      title: "Gerencie seu tempo com sabedoria",
      description: "Reserve os últimos 30 minutos para revisar suas respostas e preencher o gabarito."
    },
    {
      category: "Redação",
      title: "Pratique diferentes tipos de texto",
      description: "Treine textos dissertativo-argumentativos sobre temas atuais e sociais."
    },
    {
      category: "Matemática",
      title: "Foque nas questões básicas primeiro",
      description: "Resolva as questões mais fáceis antes de partir para as mais complexas."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Preparação ENEM 2024
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Prepare-se para o ENEM com simulados, cronograma de estudos e dicas estratégicas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Countdown */}
            <Card className="shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Calendar className="h-6 w-6" />
                  ENEM 2024
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold">156</div>
                    <div className="text-sm opacity-90">Dias</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">12</div>
                    <div className="text-sm opacity-90">Horas</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">34</div>
                    <div className="text-sm opacity-90">Minutos</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">22</div>
                    <div className="text-sm opacity-90">Segundos</div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm opacity-90">1º dia: 3 de novembro • 2º dia: 10 de novembro</p>
                </div>
              </CardContent>
            </Card>

            {/* Progress by Subject */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Progresso por Área
                </CardTitle>
                <CardDescription>
                  Acompanhe seu avanço em cada área do conhecimento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {subjects.map((subject) => (
                  <div key={subject.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{subject.name}</span>
                      <span className="text-sm text-gray-600">
                        {subject.completed}/{subject.total} questões
                      </span>
                    </div>
                    <Progress value={subject.progress} className="h-2" />
                    <div className="text-xs text-gray-500">
                      {subject.progress}% concluído
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Simulados */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Simulados ENEM
                </CardTitle>
                <CardDescription>
                  Teste seus conhecimentos com simulados completos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {simulados.map((simulado) => (
                  <div key={simulado.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{simulado.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{simulado.description}</p>
                        <div className="flex gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {simulado.duration}
                          </span>
                          <span>{simulado.questions} questões</span>
                          <Badge variant="outline" className="text-xs">
                            {simulado.difficulty}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        {simulado.status === 'completed' && (
                          <div className="text-center">
                            <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-1" />
                            <div className="text-sm font-semibold text-green-600">
                              {simulado.score}%
                            </div>
                          </div>
                        )}
                        {simulado.status === 'available' && (
                          <Button size="sm">Iniciar</Button>
                        )}
                        {simulado.status === 'locked' && (
                          <Button size="sm" variant="outline" disabled>
                            Bloqueado
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Study Plan */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Plano de Estudos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-800">4h</div>
                    <div className="text-sm text-blue-600">Meta diária</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Esta semana</span>
                      <span className="font-medium">18h / 28h</span>
                    </div>
                    <Progress value={64} className="h-2" />
                  </div>
                  
                  <Button className="w-full">
                    Ver Cronograma Completo
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Performance */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Desempenho
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-800">87%</div>
                  <div className="text-sm text-green-600">Taxa de acerto geral</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-800">654</div>
                  <div className="text-sm text-yellow-600">Questões resolvidas</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-800">23</div>
                  <div className="text-sm text-purple-600">Simulados completos</div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  Dicas ENEM
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tips.map((tip, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <Badge variant="outline" className="mb-2 text-xs">
                      {tip.category}
                    </Badge>
                    <h4 className="font-semibold text-sm mb-1">{tip.title}</h4>
                    <p className="text-xs text-gray-600">{tip.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enem;
