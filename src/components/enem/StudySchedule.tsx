
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Target, CheckCircle } from 'lucide-react';

interface StudyTask {
  id: string;
  subject: string;
  topic: string;
  completed: boolean;
  duration: number;
}

interface StudyScheduleProps {
  dailyGoalHours: number;
  weeklyGoalHours: number;
  currentWeekHours: number;
  todayTasks: StudyTask[];
}

export const StudySchedule = ({ 
  dailyGoalHours, 
  weeklyGoalHours, 
  currentWeekHours, 
  todayTasks 
}: StudyScheduleProps) => {
  const [tasks, setTasks] = useState(todayTasks);

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Cronograma de Hoje
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-800">{dailyGoalHours}h</div>
          <div className="text-sm text-blue-600">Meta diária</div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Esta semana</span>
            <span className="font-medium">{currentWeekHours}h / {weeklyGoalHours}h</span>
          </div>
          <Progress value={(currentWeekHours / weeklyGoalHours) * 100} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Tarefas de hoje</span>
            <span className="font-medium">{completedTasks} / {totalTasks}</span>
          </div>
          <Progress value={taskProgress} className="h-2" />
        </div>

        <div className="space-y-2">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className={`flex items-center gap-3 p-2 rounded border ${
                task.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={`rounded-full p-1 ${
                  task.completed ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                <CheckCircle className="h-4 w-4" />
              </button>
              <div className="flex-1">
                <div className={`text-sm font-medium ${
                  task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                }`}>
                  {task.subject} - {task.topic}
                </div>
                <div className="text-xs text-gray-500">{task.duration}min</div>
              </div>
            </div>
          ))}
        </div>
        
        <Button className="w-full mt-4">
          <Target className="h-4 w-4 mr-2" />
          Ver Cronograma Completo
        </Button>
      </CardContent>
    </Card>
  );
};
