
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: Date;
  title: string;
  subtitle: string;
}

export const CountdownTimer = ({ targetDate, title, subtitle }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <Card className="shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Calendar className="h-6 w-6" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold">{timeLeft.days}</div>
            <div className="text-sm opacity-90">Dias</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{timeLeft.hours}</div>
            <div className="text-sm opacity-90">Horas</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{timeLeft.minutes}</div>
            <div className="text-sm opacity-90">Minutos</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{timeLeft.seconds}</div>
            <div className="text-sm opacity-90">Segundos</div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm opacity-90">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
};
