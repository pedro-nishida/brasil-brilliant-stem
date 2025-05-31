
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calculator, Target, Clock, Trophy, BookOpen, Zap, CheckCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface PracticeSession {
  id: string;
  title: string;
  description: string;
  type: 'quick' | 'daily' | 'challenge' | 'review';
  difficulty: 'facil' | 'medio' | 'dificil';
  questions: number;
  timeLimit: number; // in minutes
  xpReward: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface UserPracticeStats {
  questionsAnswered: number;
  correctAnswers: number;
  totalTime: number;
  streak: number;
  completedSessions: number;
}

const Practice = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<UserPracticeStats>({
    questionsAnswered: 0,
    correctAnswers: 0,
    totalTime: 0,
    streak: 0,
    completedSessions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchPracticeStats();
  }, [user, navigate]);

  const fetchPracticeStats = async () => {
    try {
      setLoading(true);

      // Fetch math progress for practice stats
      const { data: mathProgressData, error: mathProgressError } = await supabase
        .from('user_math_progress')
        .select('*')
        .eq('user_id', user!.id);

      if (mathProgressError) throw mathProgressError;

      const questionsAnswered = mathProgressData?.reduce((sum, p) => sum + (p.tentativas || 0), 0) || 0;
      const correctAnswers = mathProgressData?.reduce((sum, p) => sum + (p.acertos || 0), 0) || 0;
      const totalTime = mathProgressData?.reduce((sum, p) => sum + (p.tempo_estudo || 0), 0) || 0;

      setStats({
        questionsAnswered,
        correctAnswers,
        totalTime,
        streak: 5, // Placeholder
        completedSessions: mathProgressData?.length || 0
      });

    } catch (error) {
      console.error('Erro ao carregar estatísticas de prática:', error);
    } finally {
      setLoading(false);
    }
  };

  const practiceSessions: PracticeSession[] = [
    {
      id: 'quick-math',
      title: 'Prática Rápida',
      description: 'Resolva 5 questões aleatórias em 10 minutos',
      type: 'quick',
      difficulty: 'medio',
      questions: 5,
      timeLimit: 10,
      xpReward: 25,
      icon: Zap,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'daily-challenge',
      title: 'Desafio Diário',
      description: 'Questões especiais do dia com bônus de XP',
      type: 'daily',
      difficulty: 'medio',
      questions: 10,
      timeLimit: 20,
      xpReward: 50,
      icon: Trophy,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'topic-review',
      title: 'Revisão de Tópicos',
      description: 'Revise tópicos que você já estudou',
      type: 'review',
      difficulty: 'facil',
      questions: 8,
      timeLimit: 15,
      xpReward: 30,
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'speed-challenge',
      title: 'Desafio de Velocidade',
      description: 'Questões rápidas para testar sua agilidade',
      type: 'challenge',
      difficulty: 'dificil',
      questions: 15,
      timeLimit: 12,
      xpReward: 75,
      icon: Clock,
      color: 'from-red-500 to-rose-500'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facil': return 'bg-green-100 text-green-800';
      case 'medio': return 'bg-yellow-100 text-yellow-800';
      case 'dificil': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const accuracyPercentage = stats.questionsAnswered > 0 ? 
    Math.round((stats.correctAnswers / stats.questionsAnswered) * 100) : 0;

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
            Prática
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Pratique com exercícios personalizados e melhore suas habilidades
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-800">{stats.questionsAnswered}</div>
              <div className="text-sm text-gray-600">Questões Respondidas</div>
            </CardContent>
          </Card>
          
          <Card className="text-center bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-800">{accuracyPercentage}%</div>
              <div className="text-sm text-gray-600">Taxa de Acerto</div>
            </CardContent>
          </Card>
          
          <Card className="text-center bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-800">{stats.totalTime}</div>
              <div className="text-sm text-gray-600">Minutos Praticados</div>
            </CardContent>
          </Card>
          
          <Card className="text-center bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-orange-100 rounded-full flex items-center justify-center">
                <Trophy className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-800">{stats.streak}</div>
              <div className="text-sm text-gray-600">Sequência Atual</div>
            </CardContent>
          </Card>
        </div>

        {/* Practice Sessions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {practiceSessions.map((session) => (
            <Card key={session.id} className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${session.color} rounded-xl flex items-center justify-center`}>
                    <session.icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge className={getDifficultyColor(session.difficulty)}>
                    {session.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{session.title}</CardTitle>
                <CardDescription className="text-sm">
                  {session.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-gray-800">{session.questions}</div>
                    <div className="text-xs text-gray-600">questões</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-800">{session.timeLimit}</div>
                    <div className="text-xs text-gray-600">minutos</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-800">{session.xpReward}</div>
                    <div className="text-xs text-gray-600">XP</div>
                  </div>
                </div>
                
                <Button 
                  className={`w-full bg-gradient-to-r ${session.color} hover:opacity-90 text-white`}
                  onClick={() => navigate('/mathematics')} // For now, redirect to math topics
                >
                  Iniciar Prática
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Performance Chart Placeholder */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Seu Desempenho</CardTitle>
            <CardDescription>Acompanhe sua evolução ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Precisão Geral</span>
                  <span className="text-sm text-gray-600">{accuracyPercentage}%</span>
                </div>
                <Progress value={accuracyPercentage} className="h-2" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.correctAnswers}</div>
                  <div className="text-sm text-gray-600">Respostas Corretas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.completedSessions}</div>
                  <div className="text-sm text-gray-600">Sessões Completas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{Math.round(stats.totalTime / 60)}</div>
                  <div className="text-sm text-gray-600">Horas Praticadas</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Practice;
