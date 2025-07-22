import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Character, GameState } from '@/types/game';
import { CharacterToken } from './CharacterToken';
import { GameHUD } from './GameHUD';
import { useToast } from '@/hooks/use-toast';

interface GameArenaProps {
  selectedCharacter: Character | null;
  onGameEnd: (winner: 'player' | 'ai', stats: any) => void;
}

export const GameArena = ({ selectedCharacter, onGameEnd }: GameArenaProps) => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>({
    player: selectedCharacter ? {
      ...selectedCharacter,
      x: 100,
      y: 300,
      currentHealth: selectedCharacter.maxHealth,
      currentMana: selectedCharacter.maxMana
    } : null,
    ai: {
      id: 'ai-enemy',
      name: 'Shadow Warrior',
      role: 'Tank',
      maxHealth: 120,
      currentHealth: 120,
      maxMana: 80,
      currentMana: 80,
      attack: 25,
      defense: 15,
      x: 700,
      y: 300
    },
    gamePhase: 'combat',
    turn: 'player',
    actionLog: []
  });

  const [selectedAction, setSelectedAction] = useState<'move' | 'attack' | 'ability' | null>(null);

  const handleAttack = useCallback(() => {
    if (!gameState.player || gameState.turn !== 'player') return;

    const damage = Math.max(1, gameState.player.attack - gameState.ai.defense);
    const newAiHealth = Math.max(0, gameState.ai.currentHealth - damage);

    setGameState(prev => ({
      ...prev,
      ai: { ...prev.ai, currentHealth: newAiHealth },
      turn: 'ai',
      actionLog: [...prev.actionLog, `${prev.player?.name} attacks for ${damage} damage!`]
    }));

    toast({
      title: "Attack!",
      description: `You deal ${damage} damage to ${gameState.ai.name}`,
    });

    if (newAiHealth <= 0) {
      setTimeout(() => {
        onGameEnd('player', {
          damageDealt: damage,
          turnsPlayed: gameState.actionLog.length + 1
        });
      }, 1000);
    }
  }, [gameState, onGameEnd, toast]);

  const handleAITurn = useCallback(() => {
    if (!gameState.player || gameState.turn !== 'ai') return;

    const damage = Math.max(1, gameState.ai.attack - gameState.player.defense);
    const newPlayerHealth = Math.max(0, gameState.player.currentHealth - damage);

    setGameState(prev => ({
      ...prev,
      player: prev.player ? { ...prev.player, currentHealth: newPlayerHealth } : null,
      turn: 'player',
      actionLog: [...prev.actionLog, `${prev.ai.name} attacks for ${damage} damage!`]
    }));

    if (newPlayerHealth <= 0) {
      setTimeout(() => {
        onGameEnd('ai', {
          damageTaken: damage,
          turnsPlayed: gameState.actionLog.length + 1
        });
      }, 1000);
    }
  }, [gameState, onGameEnd]);

  useEffect(() => {
    if (gameState.turn === 'ai') {
      const timer = setTimeout(handleAITurn, 1500);
      return () => clearTimeout(timer);
    }
  }, [gameState.turn, handleAITurn]);

  if (!gameState.player) {
    return (
      <Card className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">No Character Selected</h2>
        <p className="text-muted-foreground">Please select a character to start the battle.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <GameHUD player={gameState.player} ai={gameState.ai} turn={gameState.turn} />
      
      <Card className="p-6 bg-gradient-arena min-h-[400px] relative overflow-hidden border-gaming-blue/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--background))_100%)]" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--gaming-blue))" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Characters */}
        <CharacterToken 
          character={gameState.player} 
          isPlayer={true}
          isActive={gameState.turn === 'player'}
        />
        <CharacterToken 
          character={gameState.ai} 
          isPlayer={false}
          isActive={gameState.turn === 'ai'}
        />

        {/* Combat Actions */}
        <div className="absolute bottom-4 left-4 right-4 flex gap-2 justify-center">
          <Button
            onClick={handleAttack}
            disabled={gameState.turn !== 'player'}
            className="bg-gaming-red hover:bg-gaming-red/80 shadow-glow-accent"
          >
            Attack
          </Button>
          <Button
            variant="outline"
            disabled={gameState.turn !== 'player'}
            className="border-gaming-blue text-gaming-blue hover:bg-gaming-blue/10"
          >
            Defend
          </Button>
          <Button
            variant="outline"
            disabled={gameState.turn !== 'player' || gameState.player.currentMana < 20}
            className="border-gaming-purple text-gaming-purple hover:bg-gaming-purple/10"
          >
            Ability
          </Button>
        </div>

        {/* Turn indicator */}
        <div className="absolute top-4 right-4">
          <Badge className={gameState.turn === 'player' ? 'bg-gaming-green' : 'bg-gaming-red'}>
            {gameState.turn === 'player' ? 'Your Turn' : 'Enemy Turn'}
          </Badge>
        </div>
      </Card>

      {/* Action Log */}
      <Card className="p-4 max-h-32 overflow-y-auto">
        <h3 className="font-semibold mb-2 text-gaming-blue">Combat Log</h3>
        <div className="text-sm space-y-1">
          {gameState.actionLog.map((action, index) => (
            <div key={index} className="text-muted-foreground">
              {action}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};