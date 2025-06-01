
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Lesson {
  id: string;
  titulo: string;
  conteudo_teoria: string;
  dificuldade: string;
  xp_reward: number;
  course_id: string;
  categoria: string;
  nivel: string;
  icone: string;
  cor: string;
}

interface Exercise {
  id: string;
  enunciado: string;
  alternativas: string[] | null;
  resposta_certa: string;
  explicacao: string;
  tipo: string;
  ordem: number;
  dificuldade: string;
}

const Lesson = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showTheory, setShowTheory] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchLessonData();
  }, [user, lessonId, navigate]);

  const fetchLessonData = async () => {
    try {
      setLoading(true);

      // Fetch lesson details
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();

      if (lessonError) throw lessonError;
      setLesson(lessonData);

      // Fetch exercises
      const { data: exercisesData, error: exercisesError } = await supabase
        .from('exercises')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('ordem');

      if (exercisesError) throw exercisesError;
      
      // Convert the data to match our Exercise interface - fix the TypeScript error
      const formattedExercises = exercisesData?.map(exercise => ({
        ...exercise,
        alternativas: Array.isArray(exercise.alternativas) 
          ? exercise.alternativas as string[]
          : exercise.alternativas && typeof exercise.alternativas === 'string'
          ? JSON.parse(exercise.alternativas) as string[]
          : exercise.alternativas && typeof exercise.alternativas === 'object' && exercise.alternativas !== null
          ? exercise.alternativas as string[]
          : null
      })) || [];
      
      setExercises(formattedExercises);

    } catch (error) {
      console.error('Erro ao carregar dados da lição:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!selectedAnswer || !lesson) return;

    const currentEx = exercises[currentExercise];
    const correct = selectedAnswer === currentEx.resposta_certa;
    setIsCorrect(correct);
    setShowResult(true);

    // Update user progress with the new unified fields
    try {
      const { data: existingProgress } = await supabase
        .from('user_progress')
        .select('acertos, tentativas')
        .eq('user_id', user!.id)
        .eq('lesson_id', lesson.id)
        .single();

      await supabase
        .from('user_progress')
        .upsert({
          user_id: user!.id,
          lesson_id: lesson.id,
          pontuacao: correct ? 100 : 0,
          tentativas: (existingProgress?.tentativas || 0) + 1,
          acertos: (existingProgress?.acertos || 0) + (correct ? 1 : 0),
          concluido: false,
          ultimo_acesso: new Date().toISOString()
        });
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
    }
  };

  const handleNextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setSelectedAnswer('');
      setShowResult(false);
    } else {
      handleLessonComplete();
    }
  };

  const handleLessonComplete = async () => {
    try {
      // Mark lesson as completed
      await supabase
        .from('user_progress')
        .upsert({
          user_id: user!.id,
          lesson_id: lesson!.id,
          pontuacao: 100,
          concluido: true,
          data_conclusao: new Date().toISOString(),
          ultimo_acesso: new Date().toISOString()
        });

      toast({
        title: "Parabéns!",
        description: `Você completou a lição e ganhou ${lesson!.xp_reward} XP!`,
      });

      // Navigate back based on lesson type
      if (lesson!.course_id) {
        navigate(`/course/${lesson!.course_id}`);
      } else if (lesson!.categoria === 'matematica') {
        navigate('/mathematics');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Erro ao completar lição:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-6 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Lição não encontrada</h1>
          <Button onClick={() => navigate('/')}>Voltar ao Início</Button>
        </div>
      </div>
    );
  }

  const currentEx = exercises[currentExercise];
  const backUrl = lesson.course_id 
    ? `/course/${lesson.course_id}` 
    : lesson.categoria === 'matematica' 
    ? '/mathematics' 
    : '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(backUrl)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {lesson.course_id ? 'Voltar ao Curso' : 'Voltar'}
        </Button>

        {/* Lesson Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{lesson.titulo}</h1>
          <div className="flex items-center gap-4">
            <Badge variant="secondary">{lesson.dificuldade}</Badge>
            <Badge variant="outline">{lesson.categoria}</Badge>
            <span className="text-gray-600">{lesson.xp_reward} XP</span>
          </div>
        </div>

        {/* Theory Section */}
        {showTheory && (
          <Card className="mb-8 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-yellow-500" />
                Teoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {lesson.conteudo_teoria.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
              <Button 
                onClick={() => setShowTheory(false)}
                className="mt-6"
                disabled={exercises.length === 0}
              >
                {exercises.length > 0 ? 'Iniciar Exercícios' : 'Concluir Lição'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Exercises Section */}
        {!showTheory && exercises.length > 0 && currentEx && (
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  Exercício {currentExercise + 1} de {exercises.length}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline">{currentEx.dificuldade}</Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowTheory(true)}
                  >
                    Ver Teoria
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">{currentEx.enunciado}</h3>
                
                {currentEx.tipo === 'multiple_choice' && currentEx.alternativas && Array.isArray(currentEx.alternativas) && (
                  <div className="space-y-3">
                    {currentEx.alternativas.map((option, index) => (
                      <label 
                        key={index}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          selectedAnswer === option 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="answer"
                          value={option}
                          checked={selectedAnswer === option}
                          onChange={(e) => setSelectedAnswer(e.target.value)}
                          className="mr-3"
                          disabled={showResult}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {showResult && (
                <Card className={`border-2 ${isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className={`font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                        {isCorrect ? 'Correto!' : 'Incorreto'}
                      </span>
                    </div>
                    {currentEx.explicacao && (
                      <p className="text-gray-700">{currentEx.explicacao}</p>
                    )}
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setShowTheory(true)}
                >
                  Ver Teoria
                </Button>
                
                {!showResult ? (
                  <Button 
                    onClick={handleAnswerSubmit}
                    disabled={!selectedAnswer}
                  >
                    Confirmar Resposta
                  </Button>
                ) : (
                  <Button onClick={handleNextExercise}>
                    {currentExercise < exercises.length - 1 ? 'Próximo Exercício' : 'Concluir Lição'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* No exercises - just complete the lesson */}
        {!showTheory && exercises.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm text-center">
            <CardContent className="p-8">
              <h3 className="text-xl font-medium mb-4">Lição Concluída!</h3>
              <p className="text-gray-600 mb-6">
                Você estudou a teoria desta lição. Continue praticando!
              </p>
              <Button onClick={handleLessonComplete}>
                Concluir Lição (+{lesson.xp_reward} XP)
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Lesson;
