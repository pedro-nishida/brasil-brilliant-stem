
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, CheckCircle, X, ArrowRight, ArrowLeft } from 'lucide-react';
import { HintSystem } from './HintSystem';

interface Exercise {
  id: string;
  enunciado: string;
  tipo: string;
  alternativas?: string[];
  resposta_certa: string;
  explicacao?: string;
}

interface MicroLessonProps {
  worksheetId: string;
  exercises: Exercise[];
  onComplete: (score: number, hintsUsed: number, timeSpent: number) => void;
}

export const MicroLesson: React.FC<MicroLessonProps> = ({
  worksheetId,
  exercises,
  onComplete
}) => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showHints, setShowHints] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime] = useState(Date.now());
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const exercise = exercises[currentExercise];
  const progress = ((currentExercise + 1) / exercises.length) * 100;

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentExercise] = answer;
    setAnswers(newAnswers);

    const isCorrect = answer === exercise.resposta_certa;
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      // Move to next exercise after a short delay
      setTimeout(() => {
        if (currentExercise < exercises.length - 1) {
          setCurrentExercise(currentExercise + 1);
          setFeedback(null);
          setShowExplanation(false);
          setShowHints(false);
        } else {
          // Complete the micro-lesson
          const score = calculateScore();
          const timeSpent = Math.floor((Date.now() - startTime) / 1000);
          onComplete(score, hintsUsed, timeSpent);
        }
      }, 1500);
    } else {
      // Show explanation for incorrect answer
      setShowExplanation(true);
    }
  };

  const calculateScore = () => {
    const correctAnswers = answers.filter((answer, index) => 
      answer === exercises[index]?.resposta_certa
    ).length;
    return Math.round((correctAnswers / exercises.length) * 100);
  };

  const handleNext = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setFeedback(null);
      setShowExplanation(false);
      setShowHints(false);
    }
  };

  const handlePrevious = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
      setFeedback(null);
      setShowExplanation(false);
      setShowHints(false);
    }
  };

  const handleHintUsed = () => {
    setHintsUsed(hintsUsed + 1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary">
              Exercício {currentExercise + 1} de {exercises.length}
            </Badge>
            <Badge variant="outline">
              {hintsUsed} dicas usadas
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Exercise Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">
            {exercise.enunciado}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Answer Options */}
          {exercise.tipo === 'multiple_choice' && exercise.alternativas && (
            <div className="grid gap-3">
              {exercise.alternativas.map((alternativa, index) => (
                <Button
                  key={index}
                  variant={answers[currentExercise] === alternativa ? "default" : "outline"}
                  className={`p-4 h-auto text-left justify-start ${
                    feedback === 'correct' && alternativa === exercise.resposta_certa
                      ? 'bg-green-100 border-green-500 text-green-700'
                      : feedback === 'incorrect' && alternativa === answers[currentExercise]
                      ? 'bg-red-100 border-red-500 text-red-700'
                      : ''
                  }`}
                  onClick={() => !feedback && handleAnswer(alternativa)}
                  disabled={!!feedback}
                >
                  <span className="mr-2 font-semibold">
                    {String.fromCharCode(65 + index)})
                  </span>
                  {alternativa}
                  {feedback === 'correct' && alternativa === exercise.resposta_certa && (
                    <CheckCircle className="ml-auto h-5 w-5" />
                  )}
                  {feedback === 'incorrect' && alternativa === answers[currentExercise] && (
                    <X className="ml-auto h-5 w-5" />
                  )}
                </Button>
              ))}
            </div>
          )}

          {/* Feedback Messages */}
          {feedback === 'correct' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center text-green-700">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="font-semibold">Correto! Muito bem!</span>
              </div>
            </div>
          )}

          {feedback === 'incorrect' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center text-red-700 mb-2">
                <X className="h-5 w-5 mr-2" />
                <span className="font-semibold">Não é bem assim. Vamos tentar de novo?</span>
              </div>
              {showExplanation && exercise.explicacao && (
                <p className="text-red-600 text-sm mt-2">
                  {exercise.explicacao}
                </p>
              )}
            </div>
          )}

          {/* Hint System */}
          {!feedback && (
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHints(!showHints)}
                className="text-blue-600"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Precisa de uma dica?
              </Button>

              {showHints && (
                <HintSystem 
                  exerciseId={exercise.id} 
                  onHintUsed={handleHintUsed}
                />
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentExercise === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            {feedback === 'incorrect' && (
              <Button
                onClick={handleNext}
                disabled={currentExercise === exercises.length - 1}
              >
                Próximo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
