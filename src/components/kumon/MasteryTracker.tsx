
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, Clock, Zap } from 'lucide-react';

interface MasteryStats {
  mastery_score: number;
  consecutive_correct: number;
  attempt_count: number;
  time_per_problem: number;
  comfort_zone_indicator: number;
  mastery_threshold: number;
}

interface MasteryTrackerProps {
  stats: MasteryStats;
  lessonTitle: string;
}

export const MasteryTracker: React.FC<MasteryTrackerProps> = ({ stats, lessonTitle }) => {
  const {
    mastery_score,
    consecutive_correct,
    attempt_count,
    time_per_problem,
    comfort_zone_indicator,
    mastery_threshold
  } = stats;

  const masteryPercentage = Math.min(100, (mastery_score / mastery_threshold) * 100);
  const isNearMastery = masteryPercentage >= 80;
  const isMastered = masteryPercentage >= 100;

  const getComfortZoneColor = (indicator: number) => {
    if (indicator >= 80) return 'text-green-600';
    if (indicator >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getComfortZoneText = (indicator: number) => {
    if (indicator >= 80) return 'Zona de Conforto';
    if (indicator >= 60) return 'Desafio Adequado';
    return 'Precisa de Reforço';
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-blue-600" />
          <span>Progresso de Domínio - {lessonTitle}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mastery Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Domínio da Lição</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {mastery_score}% / {mastery_threshold}%
              </span>
              {isMastered && (
                <Badge className="bg-green-100 text-green-800">
                  Dominado!
                </Badge>
              )}
              {isNearMastery && !isMastered && (
                <Badge className="bg-yellow-100 text-yellow-800">
                  Quase lá!
                </Badge>
              )}
            </div>
          </div>
          <Progress 
            value={masteryPercentage} 
            className={`h-3 ${isMastered ? 'bg-green-100' : isNearMastery ? 'bg-yellow-100' : ''}`}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Acertos Consecutivos</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {consecutive_correct}
            </div>
            <p className="text-xs text-gray-500">
              Meta: 5 para avançar
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Tentativas</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {attempt_count}
            </div>
            <p className="text-xs text-gray-500">
              Total de exercícios
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Tempo Médio</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {time_per_problem}s
            </div>
            <p className="text-xs text-gray-500">
              Por exercício
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Target className={`h-4 w-4 ${getComfortZoneColor(comfort_zone_indicator)}`} />
              <span className="text-sm font-medium">Nível de Conforto</span>
            </div>
            <div className={`text-lg font-bold ${getComfortZoneColor(comfort_zone_indicator)}`}>
              {getComfortZoneText(comfort_zone_indicator)}
            </div>
            <Progress 
              value={comfort_zone_indicator} 
              className="h-2"
            />
          </div>
        </div>

        {/* Recommendations */}
        {!isMastered && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Recomendações:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              {consecutive_correct < 3 && (
                <li>• Foque em acertar exercícios consecutivos para construir confiança</li>
              )}
              {comfort_zone_indicator < 60 && (
                <li>• Revise o conteúdo teórico antes de continuar os exercícios</li>
              )}
              {time_per_problem > 120 && (
                <li>• Pratique mais para melhorar a velocidade de resolução</li>
              )}
              {mastery_score < 50 && (
                <li>• Use as dicas disponíveis para entender melhor os conceitos</li>
              )}
            </ul>
          </div>
        )}

        {isMastered && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <h4 className="font-semibold text-green-800 mb-2">🎉 Parabéns!</h4>
            <p className="text-sm text-green-700">
              Você dominou esta lição! Pronto para avançar para o próximo desafio.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
