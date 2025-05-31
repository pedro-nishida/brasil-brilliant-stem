
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calculator, BookOpen, Target, Brain } from 'lucide-react';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface MathTopic {
  id: string;
  titulo: string;
  conteudo_teoria: string;
  nivel: string;
  ordem: number;
  icone: string;
  cor: string;
}

interface UserProgress {
  topic_id: string;
  acertos: number;
  tentativas: number;
  tempo_estudo: number;
}

const Mathematics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [topics, setTopics] = useState<MathTopic[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

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

      // Fetch math topics
      const { data: topicsData, error: topicsError } = await supabase
        .from('math_topics')
        .select('*')
        .order('ordem');

      if (topicsError) throw topicsError;
      setTopics(topicsData || []);

      // Fetch user progress
      if (user) {
        const { data: progressData, error: progressError } = await supabase
          .from('user_math_progress')
          .select('topic_id, acertos, tentativas, tempo_estudo')
          .eq('user_id', user.id);

        if (progressError) throw progressError;
        setUserProgress(progressData || []);
      }

    } catch (error) {
      console.error('Erro ao carregar dados de matemática:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTopicProgress = (topicId: string) => {
    const progress = userProgress.find(p => p.topic_id === topicId);
    if (!progress || progress.tentativas === 0) return 0;
    return Math.round((progress.acertos / progress.tentativas) * 100);
  };

  const getLevelColor = (nivel: string) => {
    switch (nivel) {
      case 'fundamental': return 'from-green-500 to-green-600';
      case 'medio': return 'from-blue-500 to-blue-600';
      case 'avancado': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getLevelBadge = (nivel: string) => {
    switch (nivel) {
      case 'fundamental': return 'Fundamental';
      case 'medio': return 'Médio';
      case 'avancado': return 'Avançado';
      default: return nivel;
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Matemática
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Domine os conceitos fundamentais da matemática com teoria detalhada e exercícios práticos
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-800">{topics.length}</div>
              <div className="text-sm text-gray-600">Tópicos Disponíveis</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-800">
                {userProgress.reduce((sum, p) => sum + p.acertos, 0)}
              </div>
              <div className="text-sm text-gray-600">Questões Corretas</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-800">
                {userProgress.reduce((sum, p) => sum + p.tempo_estudo, 0)}
              </div>
              <div className="text-sm text-gray-600">Minutos Estudados</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-orange-100 rounded-full flex items-center justify-center">
                <Calculator className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-800">
                {userProgress.length > 0 ? 
                  Math.round(userProgress.reduce((sum, p) => sum + (p.tentativas > 0 ? (p.acertos / p.tentativas) * 100 : 0), 0) / userProgress.length) 
                  : 0}%
              </div>
              <div className="text-sm text-gray-600">Taxa de Acerto</div>
            </CardContent>
          </Card>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topics.map((topic) => {
            const progress = getTopicProgress(topic.id);
            const userTopicProgress = userProgress.find(p => p.topic_id === topic.id);
            
            return (
              <Card key={topic.id} className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getLevelColor(topic.nivel)} rounded-xl flex items-center justify-center`}>
                      <Calculator className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="secondary">
                      {getLevelBadge(topic.nivel)}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{topic.titulo}</CardTitle>
                  <CardDescription className="text-sm">
                    {topic.conteudo_teoria.substring(0, 100)}...
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userTopicProgress && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Progresso</span>
                        <span className="text-sm text-gray-600">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{userTopicProgress.acertos} acertos</span>
                        <span>{userTopicProgress.tempo_estudo}min estudados</span>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    className={`w-full bg-gradient-to-r ${getLevelColor(topic.nivel)} hover:opacity-90 text-white`}
                    onClick={() => navigate(`/math-topic/${topic.id}`)}
                  >
                    {userTopicProgress ? 'Continuar Estudos' : 'Começar Tópico'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Mathematics;
