import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface MetricCardProps {
  title: string;
  value: string | number;
  insight: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
}

export function MetricCard({ title, value, insight, icon: Icon, trend }: MetricCardProps) {
  const getTrendColor = () => {
    if (!trend) return 'text-muted-foreground';
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-muted-foreground';
  };

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">{value}</div>
        <p className={`text-sm mt-2 ${getTrendColor()}`}>
          {insight}
        </p>
      </CardContent>
    </Card>
  );
}
