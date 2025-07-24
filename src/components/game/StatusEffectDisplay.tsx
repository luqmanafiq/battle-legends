import { StatusEffect } from '@/types/game';
import { Badge } from '@/components/ui/badge';

interface StatusEffectDisplayProps {
  statusEffects: StatusEffect[];
}

const getStatusIcon = (type: StatusEffect['type']) => {
  switch (type) {
    case 'poison': return '☠️';
    case 'burn': return '🔥';
    case 'freeze': return '❄️';
    case 'strength': return '💪';
    case 'shield': return '🛡️';
    default: return '✨';
  }
};

const getStatusColor = (type: StatusEffect['type']) => {
  switch (type) {
    case 'poison': return 'text-gaming-green';
    case 'burn': return 'text-gaming-red';
    case 'freeze': return 'text-gaming-blue';
    case 'strength': return 'text-gaming-yellow';
    case 'shield': return 'text-gaming-purple';
    default: return 'text-muted-foreground';
  }
};

export const StatusEffectDisplay = ({ statusEffects }: StatusEffectDisplayProps) => {
  if (statusEffects.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {statusEffects.map((effect, index) => (
        <Badge
          key={index}
          variant="outline"
          className={`text-xs ${getStatusColor(effect.type)} border-current`}
        >
          {getStatusIcon(effect.type)} {effect.duration}
        </Badge>
      ))}
    </div>
  );
};