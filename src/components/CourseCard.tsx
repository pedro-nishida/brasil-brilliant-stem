
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Clock, Users } from "lucide-react";

interface Subject {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  lessons: number;
  completed: number;
  difficulty: string;
}

interface CourseCardProps {
  subject: Subject;
}

export const CourseCard = ({ subject }: CourseCardProps) => {
  const progress = (subject.completed / subject.lessons) * 100;
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Básico': return 'bg-green-100 text-green-700 border-green-200';
      case 'Intermediário': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Avançado': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:scale-[1.02]">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-3 rounded-xl ${subject.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <subject.icon className="h-8 w-8 text-white" />
          </div>
          <Badge variant="outline" className={getDifficultyColor(subject.difficulty)}>
            {subject.difficulty}
          </Badge>
        </div>
        
        <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
          {subject.name}
        </CardTitle>
        <CardDescription className="text-gray-600 text-base">
          {subject.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Progresso</span>
            <span className="text-sm font-bold text-gray-900">
              {subject.completed}/{subject.lessons} lições
            </span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-100">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </Progress>
          <div className="text-right">
            <span className="text-xs text-gray-500">{Math.round(progress)}% concluído</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>~{Math.ceil(subject.lessons * 0.5)}h total</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>2.3k estudantes</span>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
          size="lg"
        >
          {subject.completed > 0 ? 'Continuar Estudando' : 'Começar Curso'}
          <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>

        {/* Recent Topics */}
        {subject.completed > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Próximo tópico:</p>
            <p className="text-sm font-medium text-gray-700">
              {subject.name === 'Matemática' && 'Função Exponencial e Logarítmica'}
              {subject.name === 'Física' && 'Ondas e Fenômenos Oscilatórios'}
              {subject.name === 'Química' && 'Reações de Oxidação-Redução'}
              {subject.name === 'Biologia' && 'Genética Molecular e Biotecnologia'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
