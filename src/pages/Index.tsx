
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calculator, Atom, Zap, Trophy, Target, ChevronRight, Play, Star, LogOut } from "lucide-react";
import { Header } from "@/components/Header";
import { CourseCard } from "@/components/CourseCard";
import { StatsCard } from "@/components/StatsCard";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useCourses } from "@/hooks/useCourses";
import { useUserProgress } from "@/hooks/useUserProgress";

const Index = () => {
  const [selectedSubject, setSelectedSubject] = useState("all");
  const { user, signOut, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { courses, loading: coursesLoading } = useCourses();
  const { progress, loading: progressLoading } = useUserProgress();
  const navigate = useNavigate();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Show loading state
  if (authLoading || profileLoading || coursesLoading || progressLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Don't render if no user
  if (!user) {
    return null;
  }

  // Map courses to the expected format
  const subjects = courses.map(course => {
    const completed = progress.filter(p => p.concluido).length;
    const total = 10; // Placeholder - in real app we'd count lessons per course
    
    return {
      id: course.nome.toLowerCase(),
      name: course.nome,
      icon: course.icone === 'Calculator' ? Calculator : 
            course.icone === 'Atom' ? Atom :
            course.icone === 'Zap' ? Zap : BookOpen,
      color: `bg-gradient-to-br from-${course.cor}-500 to-${course.cor}-600`,
      description: course.descricao,
      lessons: total,
      completed,
      difficulty: "Intermediário"
    };
  });

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const completedLessons = progress.filter(p => p.concluido).length;
  const totalLessons = courses.length * 10; // Placeholder
  const currentStreak = profile?.streak_atual || 0;

  const achievements = [
    { name: "Primeira Lição", description: "Complete sua primeira lição", earned: completedLessons > 0 },
    { name: "Sequência de 7 dias", description: "Estude 7 dias seguidos", earned: currentStreak >= 7 },
    { name: "Mestre em Matemática", description: "Complete 10 lições de matemática", earned: false },
    { name: "Resolvedor Rápido", description: "Resolva 10 problemas em menos de 5 minutos", earned: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      {/* User Welcome & Logout */}
      <div className="container mx-auto px-6 pt-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Olá, {profile?.nome || 'Estudante'}! 👋
            </h2>
            <p className="text-gray-600">Continue sua jornada de aprendizado</p>
          </div>
          <Button variant="outline" onClick={handleSignOut} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-4 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Aprenda STEM de forma inteligente
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Descubra conceitos através de problemas interativos adaptados ao currículo brasileiro do Ensino Médio
          </p>
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
            <Play className="mr-2 h-5 w-5" />
            Continuar Estudos
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatsCard 
            icon={Target} 
            title="Lições Concluídas" 
            value={completedLessons.toString()}
            subtitle={`de ${totalLessons} total`}
            color="text-blue-600"
          />
          <StatsCard 
            icon={Trophy} 
            title="Conquistas" 
            value={achievements.filter(a => a.earned).length.toString()}
            subtitle={`de ${achievements.length} total`}
            color="text-yellow-600"
          />
          <StatsCard 
            icon={Zap} 
            title="Sequência Atual" 
            value={`${currentStreak} dias`}
            subtitle="Continue estudando!"
            color="text-green-600"
          />
          <StatsCard 
            icon={Star} 
            title="Pontuação XP" 
            value={profile?.xp?.toString() || "0"}
            subtitle="Continue ganhando XP"
            color="text-purple-600"
          />
        </div>

        {/* Subject Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <Button
            variant={selectedSubject === "all" ? "default" : "outline"}
            onClick={() => setSelectedSubject("all")}
            className="rounded-full"
          >
            Todas as Matérias
          </Button>
          {subjects.map((subject) => (
            <Button
              key={subject.id}
              variant={selectedSubject === subject.id ? "default" : "outline"}
              onClick={() => setSelectedSubject(subject.id)}
              className="rounded-full"
            >
              <subject.icon className="mr-2 h-4 w-4" />
              {subject.name}
            </Button>
          ))}
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {subjects
            .filter(subject => selectedSubject === "all" || subject.id === selectedSubject)
            .map((subject) => (
              <CourseCard key={subject.id} subject={subject} />
            ))}
        </div>

        {/* Achievements Section */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Suas Conquistas
            </CardTitle>
            <CardDescription>
              Acompanhe seu progresso e desbloqueie novas conquistas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    achievement.earned 
                      ? 'border-yellow-200 bg-yellow-50 shadow-md' 
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      achievement.earned ? 'bg-yellow-100' : 'bg-gray-100'
                    }`}>
                      <Trophy className={`h-4 w-4 ${
                        achievement.earned ? 'text-yellow-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-semibold">{achievement.name}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Challenge */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Desafio Diário</CardTitle>
            <CardDescription className="text-purple-100">
              Resolva o problema de hoje e ganhe pontos extras!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Função Quadrática Aplicada</h3>
                <p className="text-purple-100 mb-4">
                  Um projétil é lançado seguindo a trajetória h(t) = -5t² + 20t + 15. 
                  Qual é a altura máxima atingida?
                </p>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  +50 XP
                </Badge>
              </div>
              <Button variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                Resolver
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
