
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Target, Users, Trophy, ArrowRight, Calculator, Brain, GraduationCap, Star, CheckCircle, Globe, Zap, Award } from "lucide-react";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // If user is logged in, show dashboard version
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        
        {/* Dashboard for logged users */}
        <section className="py-20 px-6">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6 text-gray-800">
              Bem-vindo de volta! 👋
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Continue sua jornada de aprendizado. Você está fazendo um ótimo progresso!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/subjects")} className="bg-blue-600 hover:bg-blue-700">
                <GraduationCap className="mr-2 h-5 w-5" />
                Continuar Estudos
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/practice")}>
                Praticar Exercícios
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/profile")}>
                Ver Perfil
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Stats for logged users */}
        <section className="py-16 px-6 bg-white/50">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center shadow-lg border-0 bg-white/80">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle>Continue Praticando</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => navigate("/practice")} className="w-full">
                    Fazer Exercícios
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center shadow-lg border-0 bg-white/80">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle>Comunidade</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => navigate("/community")} className="w-full" variant="outline">
                    Participar
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center shadow-lg border-0 bg-white/80">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                    <Trophy className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle>ENEM 2024</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => navigate("/enem")} className="w-full" variant="outline">
                    Preparar-se
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Landing page for non-logged users
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header for non-logged users */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BrilhanteBR
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => navigate("/auth")}>
                Entrar
              </Button>
              <Button onClick={() => navigate("/auth")} className="bg-blue-600 hover:bg-blue-700">
                Cadastrar-se
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="mb-6">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
              ✨ Plataforma #1 de Educação no Brasil
            </Badge>
          </div>
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
            Transforme Seu Futuro<br />com Educação Inteligente
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            A plataforma mais completa do Brasil para preparação do ENEM e vestibulares. 
            Aprenda com conteúdo personalizado, exercícios adaptativos e acompanhe seu progresso em tempo real.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" onClick={() => navigate("/auth")} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4">
              Começar Gratuitamente
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/subjects")} className="text-lg px-8 py-4">
              Explorar Conteúdo
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>4.9/5 estrelas</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>+100mil estudantes</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>95% aprovação ENEM</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              Por que escolher a BrilhanteBR?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nossa plataforma combina tecnologia avançada com metodologia pedagógica comprovada 
              para garantir o melhor resultado nos seus estudos.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center shadow-xl border-0 bg-white hover:shadow-2xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">IA Personalizada</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Sistema inteligente que adapta o conteúdo ao seu ritmo e identifica suas dificuldades 
                  para focar no que mais importa.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-xl border-0 bg-white hover:shadow-2xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Foco no ENEM</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Preparação específica para o ENEM com simulados baseados em provas anteriores 
                  e análise detalhada do seu desempenho.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-xl border-0 bg-white hover:shadow-2xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Conteúdo Completo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Todas as matérias do ensino médio com videoaulas, teoria detalhada 
                  e milhares de exercícios organizados por dificuldade.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-xl border-0 bg-white hover:shadow-2xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Aprendizado Rápido</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Microaulas de 5-10 minutos que cabem na sua rotina. 
                  Aprenda de forma eficiente, mesmo com pouco tempo.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-xl border-0 bg-white hover:shadow-2xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Comunidade Ativa</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Conecte-se com outros estudantes, tire dúvidas em grupo 
                  e participe de desafios colaborativos.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-xl border-0 bg-white hover:shadow-2xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Gamificação</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Sistema de XP, conquistas e rankings que tornam o estudo mais 
                  divertido e motivador. Vicie em aprender!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Subjects Preview */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              Domine Todas as Matérias
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conteúdo organizado e estruturado para todas as áreas do conhecimento, 
              seguindo o currículo oficial do MEC.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 bg-white group hover:-translate-y-2" onClick={() => navigate("/subjects")}>
              <CardHeader>
                <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calculator className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-center text-lg">Matemática</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm text-center mb-4">
                  Álgebra, geometria, trigonometria, estatística e muito mais
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-gray-500">
                    <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                    <span>1.200+ exercícios</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                    <span>50+ videoaulas</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 bg-white group hover:-translate-y-2" onClick={() => navigate("/subjects")}>
              <CardHeader>
                <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Brain className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-center text-lg">Ciências</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm text-center mb-4">
                  Física, química e biologia com experimentos virtuais
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-gray-500">
                    <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                    <span>900+ exercícios</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                    <span>Laboratório virtual</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 bg-white group hover:-translate-y-2" onClick={() => navigate("/subjects")}>
              <CardHeader>
                <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-center text-lg">Linguagens</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm text-center mb-4">
                  Português, literatura, redação e língua estrangeira
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-gray-500">
                    <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                    <span>800+ exercícios</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                    <span>Correção de redação IA</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 bg-white group hover:-translate-y-2" onClick={() => navigate("/subjects")}>
              <CardHeader>
                <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Globe className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-center text-lg">Humanas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm text-center mb-4">
                  História, geografia, filosofia e sociologia
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-gray-500">
                    <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                    <span>700+ exercícios</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                    <span>Mapas interativos</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Button onClick={() => navigate("/subjects")} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4">
              Explorar Todas as Matérias
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-6 bg-white/50">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">
            Resultados que Falam por Si
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Veja o que nossos estudantes alcançaram usando a BrilhanteBR
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg">
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
                <p className="text-gray-700 font-medium">Taxa de aprovação no ENEM</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg">
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">150pts</div>
                <p className="text-gray-700 font-medium">Melhoria média na nota</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg">
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">30min</div>
                <p className="text-gray-700 font-medium">Estudo diário médio</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Pronto para Transformar seu Futuro?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Junte-se a mais de 100.000 estudantes que já estão usando a BrilhanteBR 
            para conquistar seus sonhos. Comece gratuitamente hoje mesmo!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={() => navigate("/auth")}
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
            >
              Criar Conta Gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/subjects")}
              className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4"
            >
              Ver Demonstração
            </Button>
          </div>
          
          <div className="mt-8 text-sm opacity-75">
            ✓ Sem cartão de crédito &nbsp;&nbsp; ✓ Acesso imediato &nbsp;&nbsp; ✓ Cancele quando quiser
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="h-6 w-6" />
            <span className="text-xl font-bold">BrilhanteBR</span>
          </div>
          <p className="text-gray-400 mb-6">
            A melhor plataforma de educação do Brasil
          </p>
          <div className="text-sm text-gray-500">
            © 2024 BrilhanteBR. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
