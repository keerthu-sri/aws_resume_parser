import { Badge } from './ui/badge';

interface ConfidenceBadgeProps {
  confidence: number;
  showLabel?: boolean;
}

export function ConfidenceBadge({ confidence, showLabel = true }: ConfidenceBadgeProps) {
  const getVariant = () => {
    if (confidence >= 85) return 'default';
    if (confidence >= 70) return 'secondary';
    return 'destructive';
  };

  const getLabel = () => {
    if (confidence >= 85) return 'High';
    if (confidence >= 70) return 'Medium';
    return 'Low';
  };

  return (
    <Badge variant={getVariant()} className="font-mono">
      {showLabel && `${getLabel()} · `}
      {confidence}%
    </Badge>
  );
}
