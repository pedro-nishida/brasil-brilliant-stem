
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Lightbulb, Calculator } from 'lucide-react';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MathTopic {
  id: string;
  titulo: string;
  conteudo_teoria: string;
  nivel: string;
  icone: string;
  cor: string;
}

interface MathQuestion {
  id: string;
  enunciado: string;
  alternativas: string[] | null;
  resposta_certa: string;
  explicacao: string | null;
  dificuldade: string;
  tipo: string;
  ordem: number;
}

const MathTopic = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [topic, setTopic] = useState<MathTopic | null>(null);
  const [questions, setQuestions] = useState<MathQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<'theory' | 'questions' | 'completed'>('theory');
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchTopicData();
  }, [topicId, user]);

  const fetchTopicData = async () => {
    try {
      setLoading(true);

      // Fetch topic details
      const { data: topicData, error: topicError } = await supabase
        .from('math_topics')
        .select('*')
        .eq('id', topicId)
        .single();

      if (topicError) throw topicError;
      setTopic(topicData);

      // Fetch questions for this topic
      const { data: questionsData, error: questionsError } = await supabase
        .from('math_questions')
        .select('*')
        .eq('topic_id', topicId)
        .order('ordem');

      if (questionsError) throw questionsError;
      
      // Process questions to ensure alternativas is properly typed
      const processedQuestions = questionsData?.map(q => ({
        ...q,
        alternativas: Array.isArray(q.alternativas) ? q.alternativas as string[] : null
      })) || [];
      
      setQuestions(processedQuestions);

    } catch (error) {
      console.error('Erro ao carregar tópico de matemática:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o tópico",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startQuestions = () => {
    setPhase('questions');
    setStartTime(new Date());
  };

  const submitAnswer = async () => {
    if (!selectedAnswer || !user || !topic) return;

    const question = questions[currentQuestion];
    const correct = selectedAnswer === question.resposta_certa;
    
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setCorrectAnswers(prev => prev + 1);
    }

    try {
      // Update user progress
      await supabase
        .from('user_math_progress')
        .upsert({
          user_id: user.id,
          topic_id: topic.id,
          question_id: question.id,
          acertos: correct ? 1 : 0,
          tentativas: 1,
          ultimo_acesso: new Date().toISOString()
        });

    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setShowResult(false);
    } else {
      completeQuestions();
    }
  };

  const completeQuestions = async () => {
    if (!user || !topic || !startTime) return;

    const endTime = new Date();
    const studyTime = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60)); // minutes

    try {
      // Update overall topic progress
      await supabase
        .from('user_math_progress')
        .upsert({
          user_id: user.id,
          topic_id: topic.id,
          question_id: null,
          acertos: correctAnswers,
          tentativas: questions.length,
          tempo_estudo: studyTime,
          ultimo_acesso: new Date().toISOString()
        });

      setPhase('completed');
      
      const percentage = Math.round((correctAnswers / questions.length) * 100);
      toast({
        title: "Parabéns!",
        description: `Você completou o tópico com ${percentage}% de acertos!`,
      });

    } catch (error) {
      console.error('Erro ao completar tópico:', error);
    }
  };

  const formatTheory = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <h3 key={index} className="font-bold text-lg mt-4 mb-2">
            {line.replace(/\*\*/g, '')}
          </h3>
        );
      }
      if (line.startsWith('- ')) {
        return (
          <li key={index} className="ml-6 mb-1">
            {line.substring(2)}
          </li>
        );
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return (
        <p key={index} className="mb-2">
          {line}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-6 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Tópico não encontrado</h1>
          <Button onClick={() => navigate('/mathematics')}>Voltar à Matemática</Button>
        </div>
      </div>
    );
  }

  if (phase === 'completed') {
    const percentage = Math.round((correctAnswers / questions.length) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-6 py-8">
          <Card className="max-w-2xl mx-auto text-center shadow-lg">
            <CardHeader>
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Tópico Concluído!</CardTitle>
              <CardDescription>
                Parabéns! Você completou "{topic.titulo}" com sucesso.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-800 font-semibold">
                  {correctAnswers} de {questions.length} questões corretas ({percentage}%)
                </p>
              </div>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate('/mathematics')}>
                  Ver Outros Tópicos
                </Button>
                <Button variant="outline" onClick={() => {
                  setPhase('theory');
                  setCurrentQuestion(0);
                  setCorrectAnswers(0);
                  setSelectedAnswer('');
                  setShowResult(false);
                }}>
                  Revisar Tópico
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
          <Button variant="ghost" onClick={() => navigate('/mathematics')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar à Matemática
          </Button>
          <Badge variant="secondary">
            {topic.nivel.charAt(0).toUpperCase() + topic.nivel.slice(1)}
          </Badge>
        </div>

        {phase === 'theory' && (
          <Card className="max-w-4xl mx-auto shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{topic.titulo}</CardTitle>
                  <CardDescription>Estude a teoria antes de praticar com os exercícios</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div className="text-blue-800">
                      {formatTheory(topic.conteudo_teoria)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={startQuestions}
                  disabled={questions.length === 0}
                  className="px-8"
                >
                  {questions.length > 0 ? `Praticar (${questions.length} questões)` : 'Não há questões'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {phase === 'questions' && questions.length > 0 && (
          <Card className="max-w-4xl mx-auto shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Questão {currentQuestion + 1} de {questions.length}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline">
                    {questions[currentQuestion]?.dificuldade}
                  </Badge>
                  <Badge variant="outline">
                    {correctAnswers} acertos
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4 text-lg">
                  {questions[currentQuestion]?.enunciado}
                </h3>
                
                {questions[currentQuestion]?.alternativas && (
                  <RadioGroup 
                    value={selectedAnswer} 
                    onValueChange={setSelectedAnswer}
                    disabled={showResult}
                  >
                    {questions[currentQuestion].alternativas!.map((alternativa, index) => (
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
                  {!isCorrect && (
                    <p className="text-red-700 mb-2">
                      Resposta correta: {questions[currentQuestion].resposta_certa}
                    </p>
                  )}
                  {questions[currentQuestion]?.explicacao && (
                    <p className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                      {questions[currentQuestion].explicacao}
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setPhase('theory')}
                >
                  Revisar Teoria
                </Button>
                
                {!showResult ? (
                  <Button 
                    onClick={submitAnswer}
                    disabled={!selectedAnswer}
                  >
                    Confirmar Resposta
                  </Button>
                ) : (
                  <Button onClick={nextQuestion}>
                    {currentQuestion < questions.length - 1 ? 'Próxima Questão' : 'Finalizar Tópico'}
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

export default MathTopic;
