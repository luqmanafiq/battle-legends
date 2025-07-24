import { Ability, Character } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AbilityPanelProps {
  character: Character;
  onUseAbility: (ability: Ability) => void;
  disabled: boolean;
}

export const AbilityPanel = ({ character, onUseAbility, disabled }: AbilityPanelProps) => {
  return (
    <Card className="p-4 bg-gaming-surface border-gaming-blue/30">
      <h3 className="text-lg font-semibold mb-3 text-gaming-blue">Abilities</h3>
      <div className="grid grid-cols-1 gap-2">
        {character.abilities.map((ability) => (
          <Button
            key={ability.id}
            variant="outline"
            disabled={disabled || character.currentMana < ability.manaCost}
            onClick={() => onUseAbility(ability)}
            className="justify-start text-left h-auto p-3 border-gaming-purple/30 hover:border-gaming-purple hover:bg-gaming-purple/10"
          >
            <div className="flex items-center gap-3 w-full">
              <span className="text-2xl">{ability.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{ability.name}</span>
                  <Badge variant="outline" className="text-xs border-gaming-blue text-gaming-blue">
                    {ability.manaCost} MP
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {ability.description}
                </p>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
};