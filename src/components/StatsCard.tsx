
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  subtitle: string;
  color: string;
}

export const StatsCard = ({ icon: Icon, title, value, subtitle, color }: StatsCardProps) => {
  return (
    <Card className="text-center shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className={`w-12 h-12 mx-auto mb-3 bg-opacity-20 rounded-full flex items-center justify-center ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <div className={`text-2xl font-bold ${color.replace('-600', '-800')}`}>
          {value}
        </div>
        <div className="text-sm text-gray-600 font-medium mb-1">{title}</div>
        <div className="text-xs text-gray-500">{subtitle}</div>
      </CardContent>
    </Card>
  );
};
