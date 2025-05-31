
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { User, Mail, School, Calendar, Trophy, Target, Flame, Star, Settings } from 'lucide-react';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';

interface Achievement {
  id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  xp_bonus: number;
  data_obtida: string;
}

interface UserStats {
  totalLessons: number;
  completedLessons: number;
  totalXP: number;
  currentStreak: number;
  maxStreak: number;
  mathTopicsStudied: number;
  correctAnswers: number;
  studyTimeMinutes: number;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalLessons: 0,
    completedLessons: 0,
    totalXP: 0,
    currentStreak: 0,
    maxStreak: 0,
    mathTopicsStudied: 0,
    correctAnswers: 0,
    studyTimeMinutes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchProfileData();
  }, [user, navigate]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);

      // Fetch achievements
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user!.id)
        .order('data_obtida', { ascending: false });

      if (achievementsError) throw achievementsError;
      setAchievements(achievementsData || []);

      // Fetch user progress stats
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user!.id);

      if (progressError) throw progressError;

      // Fetch math progress stats
      const { data: mathProgressData, error: mathProgressError } = await supabase
        .from('user_math_progress')
        .select('*')
        .eq('user_id', user!.id);

      if (mathProgressError) throw mathProgressError;

      // Fetch streak data
      const { data: streakData, error: streakError } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (streakError) throw streakError;

      // Calculate stats
      const completedLessons = progressData?.filter(p => p.concluido).length || 0;
      const totalLessons = progressData?.length || 0;
      const mathTopicsStudied = mathProgressData?.length || 0;
      const correctAnswers = mathProgressData?.reduce((sum, p) => sum + (p.acertos || 0), 0) || 0;
      const studyTimeMinutes = mathProgressData?.reduce((sum, p) => sum + (p.tempo_estudo || 0), 0) || 0;

      setStats({
        totalLessons,
        completedLessons,
        totalXP: profile?.xp || 0,
        currentStreak: streakData?.dias_consecutivos || 0,
        maxStreak: streakData?.maior_streak || 0,
        mathTopicsStudied,
        correctAnswers,
        studyTimeMinutes
      });

    } catch (error) {
      console.error('Erro ao carregar dados do perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const progressPercentage = stats.totalLessons > 0 ? (stats.completedLessons / stats.totalLessons) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile?.avatar || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl">
                    {profile?.nome?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {profile?.nome || 'Usuário'}
                  </h1>
                  
                  <div className="flex items-center gap-6 text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{user?.email}</span>
                    </div>
                    {profile?.escola && (
                      <div className="flex items-center gap-2">
                        <School className="h-4 w-4" />
                        <span>{profile.escola}</span>
                      </div>
                    )}
                    {profile?.idade && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{profile.idade} anos</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                      <Star className="h-4 w-4 mr-1" />
                      {stats.totalXP} XP
                    </Badge>
                    <Badge className="bg-orange-100 text-orange-800 px-3 py-1">
                      <Flame className="h-4 w-4 mr-1" />
                      {stats.currentStreak} dias
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Editar Perfil
                  </Button>
                  <Button variant="destructive" onClick={handleSignOut}>
                    Sair
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="text-center bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-800">{stats.completedLessons}</div>
              <div className="text-sm text-gray-600">Lições Concluídas</div>
              <div className="text-xs text-gray-500 mt-1">de {stats.totalLessons} total</div>
            </CardContent>
          </Card>

          <Card className="text-center bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                <Trophy className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-800">{achievements.length}</div>
              <div className="text-sm text-gray-600">Conquistas</div>
              <div className="text-xs text-gray-500 mt-1">desbloqueadas</div>
            </CardContent>
          </Card>

          <Card className="text-center bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-800">{stats.correctAnswers}</div>
              <div className="text-sm text-gray-600">Respostas Corretas</div>
              <div className="text-xs text-gray-500 mt-1">matemática</div>
            </CardContent>
          </Card>

          <Card className="text-center bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-orange-100 rounded-full flex items-center justify-center">
                <Flame className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-800">{stats.maxStreak}</div>
              <div className="text-sm text-gray-600">Maior Sequência</div>
              <div className="text-xs text-gray-500 mt-1">dias consecutivos</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Progress Overview */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Progresso Geral</CardTitle>
              <CardDescription>Seu desempenho nos cursos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Lições Concluídas</span>
                    <span className="text-sm text-gray-600">{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{stats.mathTopicsStudied}</div>
                    <div className="text-xs text-gray-600">Tópicos de Matemática</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{stats.studyTimeMinutes}</div>
                    <div className="text-xs text-gray-600">Minutos Estudados</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Conquistas Recentes</CardTitle>
              <CardDescription>Suas últimas conquistas desbloqueadas</CardDescription>
            </CardHeader>
            <CardContent>
              {achievements.length > 0 ? (
                <div className="space-y-3">
                  {achievements.slice(0, 5).map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Trophy className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{achievement.titulo}</div>
                        <div className="text-sm text-gray-600">{achievement.descricao}</div>
                      </div>
                      <Badge variant="secondary">+{achievement.xp_bonus} XP</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Trophy className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Nenhuma conquista ainda</p>
                  <p className="text-sm">Continue estudando para desbloquear conquistas!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
