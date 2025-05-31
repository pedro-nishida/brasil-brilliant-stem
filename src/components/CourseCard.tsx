
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Subject {
  id: string;
  name: string;
  icon: LucideIcon;
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
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm cursor-pointer">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-16 h-16 rounded-2xl ${subject.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <subject.icon className="h-8 w-8 text-white" />
          </div>
          <Badge variant="outline" className="text-xs">
            {subject.difficulty}
          </Badge>
        </div>
        <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
          {subject.name}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {subject.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progresso</span>
            <span className="font-medium">{subject.completed}/{subject.lessons} lições</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <Button 
          className="w-full group-hover:bg-blue-600 transition-colors"
          onClick={() => navigate(`/course/${subject.id}`)}
        >
          {subject.completed > 0 ? "Continuar" : "Começar"}
          <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};
