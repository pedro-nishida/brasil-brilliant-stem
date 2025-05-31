
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { User, School, Calendar, Trophy, Target, Zap, Star, Edit } from 'lucide-react';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, updateProfile, loading } = useProfile();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    idade: '',
    escola: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (profile) {
      setFormData({
        nome: profile.nome || '',
        idade: profile.idade?.toString() || '',
        escola: profile.escola || ''
      });
    }
  }, [user, profile, navigate]);

  const handleSave = async () => {
    try {
      const updates = {
        nome: formData.nome,
        idade: formData.idade ? parseInt(formData.idade) : null,
        escola: formData.escola || null
      };

      const { error } = await updateProfile(updates);
      
      if (error) {
        toast({
          title: "Erro",
          description: error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sucesso",
          description: "Perfil atualizado com sucesso!",
        });
        setIsEditing(false);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar perfil",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-6 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Perfil não encontrado</h1>
          <Button onClick={() => navigate('/')}>Voltar ao início</Button>
        </div>
      </div>
    );
  }

  const xpToNextLevel = 1000; // XP needed for next level
  const currentLevel = Math.floor(profile.xp / xpToNextLevel) + 1;
  const xpProgress = profile.xp % xpToNextLevel;
  const xpProgressPercentage = (xpProgress / xpToNextLevel) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={profile.avatar || undefined} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                    {profile.nome.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl">{profile.nome}</CardTitle>
                <CardDescription>
                  Estudante BrilhanteBR • Nível {currentLevel}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Progresso para Nível {currentLevel + 1}</span>
                    <span className="text-sm text-gray-600">{xpProgress}/{xpToNextLevel} XP</span>
                  </div>
                  <Progress value={xpProgressPercentage} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Star className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                    <div className="font-semibold text-blue-800">{profile.xp}</div>
                    <div className="text-xs text-blue-600">Total XP</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <Zap className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                    <div className="font-semibold text-orange-800">{profile.streak_atual}</div>
                    <div className="text-xs text-orange-600">Dias seguidos</div>
                  </div>
                </div>

                <Button 
                  onClick={() => setIsEditing(!isEditing)}
                  variant="outline" 
                  className="w-full mt-4"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditing ? 'Cancelar' : 'Editar Perfil'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="nome">Nome completo</Label>
                      <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="idade">Idade</Label>
                        <Input
                          id="idade"
                          type="number"
                          value={formData.idade}
                          onChange={(e) => setFormData({ ...formData, idade: e.target.value })}
                          placeholder="Sua idade"
                        />
                      </div>
                      <div>
                        <Label htmlFor="escola">Escola</Label>
                        <Input
                          id="escola"
                          value={formData.escola}
                          onChange={(e) => setFormData({ ...formData, escola: e.target.value })}
                          placeholder="Sua escola"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSave}>Salvar</Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Nome:</span>
                      <span className="font-medium">{profile.nome}</span>
                    </div>
                    {profile.idade && (
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Idade:</span>
                        <span className="font-medium">{profile.idade} anos</span>
                      </div>
                    )}
                    {profile.escola && (
                      <div className="flex items-center gap-3">
                        <School className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Escola:</span>
                        <span className="font-medium">{profile.escola}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Target className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Membro desde:</span>
                      <span className="font-medium">
                        {new Date(profile.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Estatísticas de Aprendizado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Star className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-blue-800">{profile.xp}</div>
                    <div className="text-sm text-blue-600">Pontos XP</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-orange-800">{profile.streak_atual}</div>
                    <div className="text-sm text-orange-600">Dias consecutivos</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Trophy className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-green-800">{currentLevel}</div>
                    <div className="text-sm text-green-600">Nível atual</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button onClick={() => navigate('/')} className="h-12">
                    Continuar Estudos
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/practice')} className="h-12">
                    Praticar Exercícios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
