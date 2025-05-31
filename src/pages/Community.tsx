
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Users, Trophy, Star, ThumbsUp, Clock } from 'lucide-react';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';

const Community = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  const discussions = [
    {
      id: 1,
      title: "Como resolver funções quadráticas mais rapidamente?",
      author: "Maria Silva",
      replies: 12,
      likes: 8,
      timeAgo: "2h",
      category: "Matemática",
      isPopular: true
    },
    {
      id: 2,
      title: "Dicas para o ENEM 2024 - Física",
      author: "João Santos",
      replies: 25,
      likes: 15,
      timeAgo: "4h",
      category: "Física",
      isPopular: true
    },
    {
      id: 3,
      title: "Projeto de Química: Reações Orgânicas",
      author: "Ana Costa",
      replies: 7,
      likes: 5,
      timeAgo: "1d",
      category: "Química",
      isPopular: false
    }
  ];

  const leaderboard = [
    { name: "Carlos Oliveira", points: 2540, position: 1 },
    { name: "Beatriz Lima", points: 2120, position: 2 },
    { name: "Pedro Alves", points: 1890, position: 3 },
    { name: "Sofia Mendes", points: 1650, position: 4 },
    { name: "Lucas Ferreira", points: 1420, position: 5 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Comunidade BrilhanteBR
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Conecte-se com outros estudantes, compartilhe conhecimento e cresça junto
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Começar uma Discussão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-12 bg-blue-600 hover:bg-blue-700">
                    Fazer Pergunta
                  </Button>
                  <Button variant="outline" className="h-12">
                    Compartilhar Dica
                  </Button>
                  <Button variant="outline" className="h-12">
                    Criar Grupo de Estudo
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Popular Discussions */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Discussões Populares</CardTitle>
                <CardDescription>
                  Veja o que a comunidade está discutindo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {discussions.map((discussion) => (
                  <div key={discussion.id} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 flex-1 mr-4">
                        {discussion.title}
                      </h3>
                      {discussion.isPopular && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                          Popular
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span>por {discussion.author}</span>
                      <Badge variant="outline">{discussion.category}</Badge>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {discussion.timeAgo}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {discussion.replies} respostas
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        {discussion.likes} curtidas
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Study Groups */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Grupos de Estudo Ativos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Matemática ENEM 2024</h3>
                    <p className="text-sm text-gray-600 mb-3">Preparação focada em funções e geometria</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">23 membros</span>
                      <Button size="sm">Participar</Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Física - Mecânica</h3>
                    <p className="text-sm text-gray-600 mb-3">Resolução de exercícios de cinemática</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">18 membros</span>
                      <Button size="sm">Participar</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Estatísticas da Comunidade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-800">1.247</div>
                  <div className="text-sm text-blue-600">Membros Ativos</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-800">543</div>
                  <div className="text-sm text-green-600">Discussões</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-800">89</div>
                  <div className="text-sm text-purple-600">Grupos de Estudo</div>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Top Contribuidores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {leaderboard.map((user) => (
                  <div key={user.position} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      user.position === 1 ? 'bg-yellow-100 text-yellow-800' :
                      user.position === 2 ? 'bg-gray-100 text-gray-800' :
                      user.position === 3 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {user.position}
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.points} pontos</div>
                    </div>
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

export default Community;
