import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, User, Zap, Swords } from 'lucide-react';

interface GameModeSelectorProps {
  onModeSelect: (mode: 'single' | 'multiplayer') => void;
  onBack: () => void;
}

export const GameModeSelector = ({ onModeSelect, onBack }: GameModeSelectorProps) => {
  return (
    <div className="space-y-6 text-center">
      <div>
        <h2 className="text-3xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Select Game Mode
        </h2>
        <p className="text-muted-foreground">
          Choose how you want to battle in the arena
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <Card 
          className="p-6 hover:shadow-glow-primary transition-all duration-300 cursor-pointer" 
          onClick={() => onModeSelect('single')}
        >
          <User className="w-16 h-16 mx-auto mb-4 text-gaming-blue" />
          <h3 className="text-xl font-semibold mb-2">Single Player</h3>
          <p className="text-muted-foreground mb-4">
            Battle against an AI opponent with item shopping
          </p>
          <div className="space-y-2">
            <Badge variant="outline" className="border-gaming-blue text-gaming-blue">
              <Zap className="w-3 h-3 mr-1" />
              AI Combat
            </Badge>
            <Badge variant="outline" className="border-gaming-green text-gaming-green">
              <Swords className="w-3 h-3 mr-1" />
              Item Shop
            </Badge>
          </div>
        </Card>

        <Card 
          className="p-6 hover:shadow-glow-secondary transition-all duration-300 cursor-pointer" 
          onClick={() => onModeSelect('multiplayer')}
        >
          <Users className="w-16 h-16 mx-auto mb-4 text-gaming-purple" />
          <h3 className="text-xl font-semibold mb-2">Local Multiplayer</h3>
          <p className="text-muted-foreground mb-4">
            Battle against a friend on the same device
          </p>
          <div className="space-y-2">
            <Badge variant="outline" className="border-gaming-purple text-gaming-purple">
              <Users className="w-3 h-3 mr-1" />
              2 Players
            </Badge>
            <Badge variant="outline" className="border-gaming-green text-gaming-green">
              <Swords className="w-3 h-3 mr-1" />
              Item Shop
            </Badge>
          </div>
        </Card>
      </div>

      <Button 
        variant="outline" 
        onClick={onBack}
        className="border-gaming-blue text-gaming-blue hover:bg-gaming-blue/10"
      >
        Back to Menu
      </Button>
    </div>
  );
};