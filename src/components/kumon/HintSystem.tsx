
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Hint {
  id: string;
  content: string;
  hint_level: number;
  ordem: number;
}

interface HintSystemProps {
  exerciseId: string;
  onHintUsed: () => void;
}

export const HintSystem: React.FC<HintSystemProps> = ({ exerciseId, onHintUsed }) => {
  const [hints, setHints] = useState<Hint[]>([]);
  const [currentHintLevel, setCurrentHintLevel] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHints();
  }, [exerciseId]);

  const fetchHints = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hints')
        .select('*')
        .eq('exercise_id', exerciseId)
        .order('hint_level', { ascending: true });

      if (error) throw error;
      setHints(data || []);
    } catch (error) {
      console.error('Erro ao carregar dicas:', error);
    } finally {
      setLoading(false);
    }
  };

  const showNextHint = () => {
    if (currentHintLevel < hints.length) {
      setCurrentHintLevel(currentHintLevel + 1);
      onHintUsed();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (hints.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Display current hints */}
      {hints.slice(0, currentHintLevel).map((hint, index) => (
        <Card key={hint.id} className="bg-blue-50 border-blue-200">
          <CardContent className="p-3">
            <div className="flex items-start space-x-2">
              <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800 mb-1">
                  Dica {index + 1}:
                </p>
                <p className="text-sm text-blue-700">
                  {hint.content}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Show next hint button */}
      {currentHintLevel < hints.length && (
        <Button
          variant="outline"
          size="sm"
          onClick={showNextHint}
          className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
        >
          <Lightbulb className="h-4 w-4 mr-2" />
          {currentHintLevel === 0 ? 'Ver primeira dica' : `Ver próxima dica (${currentHintLevel + 1}/${hints.length})`}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      )}

      {currentHintLevel >= hints.length && hints.length > 0 && (
        <div className="text-center p-2">
          <p className="text-sm text-gray-500">
            Todas as dicas foram mostradas
          </p>
        </div>
      )}
    </div>
  );
};
