import { Character } from '@/types/game';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Heart, Zap, Shield, Sword } from 'lucide-react';

interface GameHUDProps {
  player: Character;
  player2?: Character | null;
  ai: Character;
  turn: 'player' | 'player2' | 'ai';
  gameMode: 'single' | 'multiplayer';
}

export const GameHUD = ({ player, player2, ai, turn, gameMode }: GameHUDProps) => {
  const CharacterHUD = ({ character, isPlayer }: { character: Character; isPlayer: boolean }) => {
    const healthPercentage = (character.currentHealth / character.maxHealth) * 100;
    const manaPercentage = (character.currentMana / character.maxMana) * 100;

    return (
      <Card className={`p-4 ${isPlayer ? 'border-gaming-blue/50' : 'border-gaming-red/50'}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className={`
            w-12 h-12 rounded-full border-2 flex items-center justify-center
            ${isPlayer ? 'border-gaming-blue bg-gaming-blue/20' : 'border-gaming-red bg-gaming-red/20'}
          `}>
            {character.role === 'Tank' && <Shield className="w-6 h-6" />}
            {character.role === 'DPS' && <Sword className="w-6 h-6" />}
            {character.role === 'Support' && <Heart className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="font-bold text-lg">{character.name}</h3>
            <Badge variant="outline" className={`
              ${character.role === 'Tank' ? 'border-gaming-blue text-gaming-blue' : ''}
              ${character.role === 'DPS' ? 'border-gaming-red text-gaming-red' : ''}
              ${character.role === 'Support' ? 'border-gaming-green text-gaming-green' : ''}
            `}>
              {character.role}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-gaming-red" />
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>Health</span>
                <span>{character.currentHealth}/{character.maxHealth}</span>
              </div>
              <Progress value={healthPercentage} className="h-2" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-gaming-blue" />
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>Mana</span>
                <span>{character.currentMana}/{character.maxMana}</span>
              </div>
              <Progress value={manaPercentage} className="h-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 text-sm">
            <div className="flex justify-between">
              <span>Attack:</span>
              <span className="font-semibold">{character.attack}</span>
            </div>
            <div className="flex justify-between">
              <span>Defense:</span>
              <span className="font-semibold">{character.defense}</span>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  if (gameMode === 'multiplayer') {
    return (
      <div className="grid grid-cols-2 gap-4">
        {/* Player 1 HUD */}
        <div className="space-y-2">
          <Badge className={turn === 'player' ? 'bg-gaming-green' : 'bg-muted'}>
            Player 1
          </Badge>
          <CharacterHUD character={player} isPlayer={true} />
        </div>

        {/* Player 2 HUD */}
        <div className="space-y-2">
          <Badge className={turn === 'player2' ? 'bg-gaming-purple' : 'bg-muted'}>
            Player 2
          </Badge>
          {player2 && <CharacterHUD character={player2} isPlayer={true} />}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Player HUD */}
      <div className="space-y-2">
        <Badge className={turn === 'player' ? 'bg-gaming-green' : 'bg-muted'}>
          Player
        </Badge>
        <CharacterHUD character={player} isPlayer={true} />
      </div>

      {/* AI HUD */}
      <div className="space-y-2">
        <Badge className={turn === 'ai' ? 'bg-gaming-red' : 'bg-muted'}>
          Enemy
        </Badge>
        <CharacterHUD character={ai} isPlayer={false} />
      </div>
    </div>
  );
};