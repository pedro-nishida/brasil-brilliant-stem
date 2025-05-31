
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type Lesson = Database['public']['Tables']['lessons']['Row'];
type Exercise = Database['public']['Tables']['exercises']['Row'];

const Lesson = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<'content' | 'exercises' | 'completed'>('content');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchLessonData();
  }, [lessonId, user]);

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

      // Fetch exercises for this lesson
      const { data: exercisesData, error: exercisesError } = await supabase
        .from('exercises')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('ordem');

      if (exercisesError) throw exercisesError;
      setExercises(exercisesData || []);

    } catch (error) {
      console.error('Erro ao carregar lição:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lição",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!selectedAnswer || !user || !lesson) return;

    const exercise = exercises[currentExercise];
    const correct = selectedAnswer === exercise.resposta_certa;
    
    setIsCorrect(correct);
    setShowResult(true);

    try {
      // Call submit-answer edge function
      const { data, error } = await supabase.functions.invoke('submit-answer', {
        body: {
          user_id: user.id,
          lesson_id: lesson.id,
          exercise_id: exercise.id,
          user_answer: selectedAnswer,
          is_correct: correct
        }
      });

      if (error) {
        console.error('Erro ao submeter resposta:', error);
      }
    } catch (error) {
      console.error('Erro ao chamar função:', error);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setSelectedAnswer('');
      setShowResult(false);
    } else {
      // Completed all exercises
      completeLesson();
    }
  };

  const completeLesson = async () => {
    if (!user || !lesson) return;

    try {
      // Update user progress
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lesson.id,
          concluido: true,
          data_conclusao: new Date().toISOString()
        });

      if (error) throw error;

      setPhase('completed');
      
      toast({
        title: "Parabéns!",
        description: `Você concluiu a lição e ganhou ${lesson.xp_reward} XP!`,
      });

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
          <Button onClick={() => navigate('/')}>Voltar ao início</Button>
        </div>
      </div>
    );
  }

  if (phase === 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-6 py-8">
          <Card className="max-w-2xl mx-auto text-center shadow-lg">
            <CardHeader>
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Lição Concluída!</CardTitle>
              <CardDescription>
                Parabéns! Você completou "{lesson.titulo}" com sucesso.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-800 font-semibold">+{lesson.xp_reward} XP conquistados!</p>
              </div>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate(`/course/${lesson.course_id}`)}>
                  Ver Curso
                </Button>
                <Button variant="outline" onClick={() => navigate('/')}>
                  Voltar ao Início
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => navigate(`/course/${lesson.course_id}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Curso
          </Button>
          <Badge variant="secondary">
            {lesson.dificuldade} • +{lesson.xp_reward} XP
          </Badge>
        </div>

        {phase === 'content' && (
          <Card className="max-w-4xl mx-auto shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">{lesson.titulo}</CardTitle>
              <CardDescription>Leia o conteúdo abaixo e depois pratique com os exercícios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">Conteúdo da Lição</h3>
                      <div className="text-blue-800 whitespace-pre-line">{lesson.conteudo}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={() => setPhase('exercises')}
                  disabled={exercises.length === 0}
                  className="px-8"
                >
                  {exercises.length > 0 ? 'Começar Exercícios' : 'Não há exercícios'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {phase === 'exercises' && exercises.length > 0 && (
          <Card className="max-w-4xl mx-auto shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Exercício {currentExercise + 1} de {exercises.length}</CardTitle>
                <Badge variant="outline">
                  {Math.round(((currentExercise + 1) / exercises.length) * 100)}% concluído
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4 text-lg">
                  {exercises[currentExercise]?.enunciado}
                </h3>
                
                {exercises[currentExercise]?.alternativas && Array.isArray(exercises[currentExercise].alternativas) && (
                  <RadioGroup 
                    value={selectedAnswer} 
                    onValueChange={setSelectedAnswer}
                    disabled={showResult}
                  >
                    {(exercises[currentExercise].alternativas as string[]).map((alternativa, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={alternativa} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="cursor-pointer">
                          {alternativa}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>

              {showResult && (
                <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                      {isCorrect ? 'Correto!' : 'Incorreto'}
                    </span>
                  </div>
                  {exercises[currentExercise]?.explicacao && (
                    <p className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                      {exercises[currentExercise].explicacao}
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setPhase('content')}
                >
                  Revisar Conteúdo
                </Button>
                
                {!showResult ? (
                  <Button 
                    onClick={submitAnswer}
                    disabled={!selectedAnswer}
                  >
                    Confirmar Resposta
                  </Button>
                ) : (
                  <Button onClick={nextExercise}>
                    {currentExercise < exercises.length - 1 ? 'Próximo Exercício' : 'Finalizar Lição'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Lesson;
