
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, Lock, PlayCircle } from 'lucide-react';

interface Simulado {
  id: number;
  title: string;
  description: string;
  duration: string;
  questions: number;
  status: 'available' | 'locked' | 'completed';
  difficulty: string;
  score?: number;
}

interface SimuladoCardProps {
  simulado: Simulado;
  onStart: (id: number) => void;
}

export const SimuladoCard = ({ simulado, onStart }: SimuladoCardProps) => {
  const getStatusIcon = () => {
    switch (simulado.status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'locked':
        return <Lock className="h-6 w-6 text-gray-400" />;
      default:
        return <PlayCircle className="h-6 w-6 text-blue-600" />;
    }
  };

  const getStatusColor = () => {
    switch (simulado.status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'locked':
        return 'border-gray-200 bg-gray-50';
      default:
        return 'border-blue-200 bg-blue-50 hover:bg-blue-100';
    }
  };

  return (
    <div className={`p-4 border rounded-lg transition-colors ${getStatusColor()}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold mb-1 flex items-center gap-2">
            {getStatusIcon()}
            {simulado.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2">{simulado.description}</p>
          <div className="flex gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {simulado.duration}
            </span>
            <span>{simulado.questions} questões</span>
            <Badge variant="outline" className="text-xs">
              {simulado.difficulty}
            </Badge>
          </div>
        </div>
        
        <div className="ml-4">
          {simulado.status === 'completed' && (
            <div className="text-center">
              <div className="text-sm font-semibold text-green-600 mb-1">
                Concluído
              </div>
              <div className="text-lg font-bold text-green-600">
                {simulado.score}%
              </div>
            </div>
          )}
          {simulado.status === 'available' && (
            <Button 
              size="sm" 
              onClick={() => onStart(simulado.id)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Iniciar
            </Button>
          )}
          {simulado.status === 'locked' && (
            <Button size="sm" variant="outline" disabled>
              Bloqueado
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
