
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Target, Users, Trophy, ArrowRight, Calculator, Brain, GraduationCap } from "lucide-react";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useCourses } from "@/hooks/useCourses";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { courses, loading } = useCourses();

  // Show featured courses (first 3)
  const featuredCourses = courses.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Transforme Seu Futuro com Educação
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Plataforma completa de ensino com cursos interativos, exercícios práticos e acompanhamento personalizado. 
            Prepare-se para o ENEM e vestibulares com conteúdo de qualidade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Button size="lg" onClick={() => navigate("/subjects")} className="bg-blue-600 hover:bg-blue-700">
                <GraduationCap className="mr-2 h-5 w-5" />
                Continuar Estudos
              </Button>
            ) : (
              <Button size="lg" onClick={() => navigate("/auth")} className="bg-blue-600 hover:bg-blue-700">
                Começar Agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            <Button size="lg" variant="outline" onClick={() => navigate("/subjects")}>
              Explorar Conteúdo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Por que escolher nossa plataforma?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center shadow-lg border-0 bg-white/80">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Conteúdo Completo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Acesso a todas as matérias do ensino médio com teoria detalhada e exercícios práticos.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg border-0 bg-white/80">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <Target className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Foco no ENEM</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Preparação específica para o ENEM com simulados e questões baseadas em provas anteriores.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg border-0 bg-white/80">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>Comunidade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Participe de uma comunidade ativa de estudantes e tire suas dúvidas com colegas.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg border-0 bg-white/80">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle>Gamificação</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Sistema de XP, conquistas e rankings para tornar o aprendizado mais envolvente.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Subjects Preview */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Explore Nossas Matérias
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-0 bg-white/80 backdrop-blur-sm" onClick={() => navigate("/subjects")}>
              <CardHeader>
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-center">Matemática</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm text-center">
                  Álgebra, geometria, trigonometria e muito mais
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-0 bg-white/80 backdrop-blur-sm" onClick={() => navigate("/subjects")}>
              <CardHeader>
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-center">Ciências</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm text-center">
                  Física, química e biologia aplicadas
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-0 bg-white/80 backdrop-blur-sm" onClick={() => navigate("/subjects")}>
              <CardHeader>
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-center">Linguagens</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm text-center">
                  Português, literatura e redação
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-0 bg-white/80 backdrop-blur-sm" onClick={() => navigate("/subjects")}>
              <CardHeader>
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-center">Humanas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm text-center">
                  História, geografia e filosofia
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-8">
            <Button onClick={() => navigate("/subjects")} className="bg-gradient-to-r from-blue-600 to-purple-600">
              Ver Todas as Matérias
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      {!loading && featuredCourses.length > 0 && (
        <section className="py-16 px-6 bg-white/50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Cursos em Destaque
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredCourses.map((course) => (
                <Card key={course.id} className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-0 bg-white/80">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <GraduationCap className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="secondary">Curso</Badge>
                    </div>
                    <CardTitle>{course.nome}</CardTitle>
                    <CardDescription>{course.descricao}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full" 
                      onClick={() => user ? navigate(`/course/${course.id}`) : navigate('/auth')}
                    >
                      {user ? 'Acessar Curso' : 'Fazer Login'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para começar sua jornada educacional?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhares de estudantes que já estão transformando seu futuro.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            onClick={() => user ? navigate("/subjects") : navigate("/auth")}
          >
            {user ? 'Acessar Plataforma' : 'Criar Conta Gratuita'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
