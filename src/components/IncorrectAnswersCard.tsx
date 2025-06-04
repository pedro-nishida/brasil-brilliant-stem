
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, BookOpen, AlertCircle, Filter } from 'lucide-react';
import { useIncorrectAnswers } from '@/hooks/useIncorrectAnswers';

export const IncorrectAnswersCard = () => {
  const { 
    incorrectAnswers, 
    loading, 
    filters, 
    updateFilters, 
    resetFilters,
    refetch 
  } = useIncorrectAnswers();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facil': return 'bg-green-100 text-green-800';
      case 'medio': return 'bg-yellow-100 text-yellow-800';
      case 'dificil': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const subjects = ['all', 'Matemática', 'Português', 'Ciências', 'História'];
  const difficulties = ['all', 'facil', 'medio', 'dificil'];

  if (loading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-red-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-red-800">Exercícios para Revisar</CardTitle>
              <CardDescription>
                {incorrectAnswers.length} exercícios que precisam de atenção
              </CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={refetch}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-4 pt-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Filtros:</span>
          </div>
          
          <Select value={filters.subject} onValueChange={(value) => updateFilters({ subject: value })}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Matéria" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map(subject => (
                <SelectItem key={subject} value={subject}>
                  {subject === 'all' ? 'Todas as matérias' : subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.difficulty} onValueChange={(value) => updateFilters({ difficulty: value })}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Dificuldade" />
            </SelectTrigger>
            <SelectContent>
              {difficulties.map(difficulty => (
                <SelectItem key={difficulty} value={difficulty}>
                  {difficulty === 'all' ? 'Todas' : difficulty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Limpar filtros
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {incorrectAnswers.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhum exercício para revisar encontrado!</p>
            <p className="text-sm text-gray-500 mt-2">
              {filters.subject !== 'all' || filters.difficulty !== 'all' 
                ? 'Tente ajustar os filtros ou continue praticando.'
                : 'Continue praticando para melhorar seu desempenho.'
              }
            </p>
          </div>
        ) : (
          <>
            {incorrectAnswers.slice(0, 5).map((item, index) => (
              <div key={item.id} className="p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {item.exercise.lesson.course.nome}
                      </Badge>
                      <Badge className={getDifficultyColor(item.exercise.dificuldade)}>
                        {item.exercise.dificuldade}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">
                      {item.exercise.lesson.titulo}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.exercise.enunciado}
                    </p>
                    <p className="text-xs text-gray-500">
                      Última tentativa: {new Date(item.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="ml-4">
                    Revisar
                  </Button>
                </div>
              </div>
            ))}

            {incorrectAnswers.length > 5 && (
              <div className="text-center pt-4">
                <Button variant="outline">
                  Ver todos os {incorrectAnswers.length} exercícios
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
