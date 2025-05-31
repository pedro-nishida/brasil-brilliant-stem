
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Subject {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
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
  const navigate = useNavigate();
  const progress = subject.lessons > 0 ? (subject.completed / subject.lessons) * 100 : 0;

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 ${subject.color} rounded-xl flex items-center justify-center`}>
            <subject.icon className="h-6 w-6 text-white" />
          </div>
          <Badge variant="secondary">
            {subject.difficulty}
          </Badge>
        </div>
        <CardTitle className="text-xl">{subject.name}</CardTitle>
        <CardDescription className="text-sm">
          {subject.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progresso</span>
            <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{subject.completed} concluídas</span>
            <span>{subject.lessons} lições total</span>
          </div>
        </div>
        
        <Button 
          className="w-full"
          onClick={() => navigate(`/course/${subject.id}`)}
        >
          {subject.completed > 0 ? 'Continuar Curso' : 'Começar Curso'}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};
