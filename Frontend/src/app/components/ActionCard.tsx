import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
}

export function ActionCard({ title, description, icon: Icon, path }: ActionCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="cursor-pointer border-2 hover:border-primary transition-all h-full"
        onClick={() => navigate(path)}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Icon className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
