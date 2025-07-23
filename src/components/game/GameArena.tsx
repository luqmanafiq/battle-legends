import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Character, GameState, Item } from '@/types/game';
import { CharacterToken } from './CharacterToken';
import { GameHUD } from './GameHUD';
import { ItemShop } from './ItemShop';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Coins } from 'lucide-react';

interface GameArenaProps {
  selectedCharacter: Character | null;
  selectedCharacter2?: Character | null;
  gameMode: 'single' | 'multiplayer';
  onGameEnd: (winner: 'player' | 'player2' | 'ai', stats: any) => void;
}

export const GameArena = ({ selectedCharacter, selectedCharacter2, gameMode, onGameEnd }: GameArenaProps) => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>({
    player: selectedCharacter ? {
      ...selectedCharacter,
      x: 100,
      y: 300,
      currentHealth: selectedCharacter.maxHealth,
      currentMana: selectedCharacter.maxMana
    } : null,
    player2: gameMode === 'multiplayer' && selectedCharacter2 ? {
      ...selectedCharacter2,
      x: 400,
      y: 300,
      currentHealth: selectedCharacter2.maxHealth,
      currentMana: selectedCharacter2.maxMana
    } : null,
    ai: gameMode === 'single' ? {
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
      y: 300,
      gold: 0,
      items: []
    } : {
      id: 'ai-dummy',
      name: 'Training Dummy',
      role: 'Tank',
      maxHealth: 1,
      currentHealth: 1,
      maxMana: 0,
      currentMana: 0,
      attack: 0,
      defense: 0,
      x: 700,
      y: 300,
      gold: 0,
      items: []
    },
    gamePhase: 'combat',
    turn: 'player',
    actionLog: [],
    gameMode,
    shopOpen: false
  });

  const [selectedAction, setSelectedAction] = useState<'move' | 'attack' | 'ability' | null>(null);

  // Calculate character stats with items
  const getCharacterWithItems = (character: Character) => {
    let totalStats = { ...character };
    character.items.forEach(item => {
      if (item.stats.attack) totalStats.attack += item.stats.attack;
      if (item.stats.defense) totalStats.defense += item.stats.defense;
      if (item.stats.health) {
        totalStats.maxHealth += item.stats.health;
        totalStats.currentHealth += item.stats.health;
      }
      if (item.stats.mana) {
        totalStats.maxMana += item.stats.mana;
        totalStats.currentMana += item.stats.mana;
      }
    });
    return totalStats;
  };

  const handleItemPurchase = (item: Item, forPlayer2 = false) => {
    setGameState(prev => {
      const targetPlayer = forPlayer2 ? 'player2' : 'player';
      const currentPlayer = prev[targetPlayer];
      
      if (!currentPlayer || currentPlayer.gold < item.cost) return prev;

      return {
        ...prev,
        [targetPlayer]: {
          ...currentPlayer,
          gold: currentPlayer.gold - item.cost,
          items: [...currentPlayer.items, item]
        },
        shopOpen: false
      };
    });
  };

  const handleAttack = useCallback((isPlayer2 = false) => {
    const currentPlayer = isPlayer2 ? gameState.player2 : gameState.player;
    const currentTurn = isPlayer2 ? 'player2' : 'player';
    
    if (!currentPlayer || gameState.turn !== currentTurn) return;

    const playerWithItems = getCharacterWithItems(currentPlayer);
    let target, newTargetHealth, nextTurn;
    
    if (gameMode === 'multiplayer') {
      target = isPlayer2 ? gameState.player : gameState.player2;
      const damage = Math.max(1, playerWithItems.attack - (target ? getCharacterWithItems(target).defense : 0));
      newTargetHealth = Math.max(0, (target?.currentHealth || 0) - damage);
      nextTurn = isPlayer2 ? 'player' : 'player2';
      
      setGameState(prev => ({
        ...prev,
        [isPlayer2 ? 'player' : 'player2']: target ? { ...target, currentHealth: newTargetHealth } : null,
        turn: nextTurn,
        actionLog: [...prev.actionLog, `${currentPlayer.name} attacks for ${damage} damage!`]
      }));

      if (newTargetHealth <= 0) {
        // Award gold to winner
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            [currentTurn]: { ...currentPlayer, gold: currentPlayer.gold + 50 }
          }));
          
          onGameEnd(currentTurn, {
            damageDealt: damage,
            turnsPlayed: gameState.actionLog.length + 1
          });
        }, 1000);
      }
    } else {
      // Single player vs AI
      const damage = Math.max(1, playerWithItems.attack - gameState.ai.defense);
      newTargetHealth = Math.max(0, gameState.ai.currentHealth - damage);

      setGameState(prev => ({
        ...prev,
        ai: { ...prev.ai, currentHealth: newTargetHealth },
        turn: 'ai',
        actionLog: [...prev.actionLog, `${currentPlayer.name} attacks for ${damage} damage!`],
        player: { ...currentPlayer, gold: currentPlayer.gold + 10 } // Award gold for attacking
      }));

      if (newTargetHealth <= 0) {
        setTimeout(() => {
          onGameEnd('player', {
            damageDealt: damage,
            turnsPlayed: gameState.actionLog.length + 1
          });
        }, 1000);
      }
    }

    toast({
      title: "Attack!",
      description: `${currentPlayer.name} deals damage!`,
    });
  }, [gameState, gameMode, onGameEnd, toast]);

  const handleAITurn = useCallback(() => {
    if (!gameState.player || gameState.turn !== 'ai' || gameMode !== 'single') return;

    const playerWithItems = getCharacterWithItems(gameState.player);
    const damage = Math.max(1, gameState.ai.attack - playerWithItems.defense);
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
  }, [gameState, gameMode, onGameEnd]);

  useEffect(() => {
    if (gameState.turn === 'ai') {
      const timer = setTimeout(handleAITurn, 1500);
      return () => clearTimeout(timer);
    }
  }, [gameState.turn, handleAITurn]);

  if (!gameState.player || (gameMode === 'multiplayer' && !gameState.player2)) {
    return (
      <Card className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Characters Not Ready</h2>
        <p className="text-muted-foreground">
          {gameMode === 'multiplayer' ? 'Both players must select characters.' : 'Please select a character to start the battle.'}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Shop and Gold Display */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Card className="p-3 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="font-bold text-yellow-500">P1: {gameState.player.gold}g</span>
            </div>
          </Card>
          {gameMode === 'multiplayer' && gameState.player2 && (
            <Card className="p-3 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-yellow-500">P2: {gameState.player2.gold}g</span>
              </div>
            </Card>
          )}
        </div>
        <Button
          onClick={() => setGameState(prev => ({ ...prev, shopOpen: true }))}
          className="bg-gaming-purple hover:bg-gaming-purple/80"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Item Shop
        </Button>
      </div>

      <GameHUD 
        player={gameState.player} 
        player2={gameState.player2}
        ai={gameState.ai} 
        turn={gameState.turn}
        gameMode={gameMode}
      />
      
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
          character={getCharacterWithItems(gameState.player)} 
          isPlayer={true}
          isActive={gameState.turn === 'player'}
        />
        {gameMode === 'multiplayer' && gameState.player2 && (
          <CharacterToken 
            character={getCharacterWithItems(gameState.player2)} 
            isPlayer={true}
            isActive={gameState.turn === 'player2'}
          />
        )}
        {gameMode === 'single' && (
          <CharacterToken 
            character={gameState.ai} 
            isPlayer={false}
            isActive={gameState.turn === 'ai'}
          />
        )}

        {/* Combat Actions */}
        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          {gameMode === 'single' && (
            <div className="flex gap-2 justify-center">
              <Button
                onClick={() => handleAttack()}
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
            </div>
          )}
          
          {gameMode === 'multiplayer' && (
            <div className="space-y-2">
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={() => handleAttack()}
                  disabled={gameState.turn !== 'player'}
                  className="bg-gaming-red hover:bg-gaming-red/80"
                >
                  Player 1 Attack
                </Button>
                <Button
                  onClick={() => handleAttack(true)}
                  disabled={gameState.turn !== 'player2'}
                  className="bg-gaming-purple hover:bg-gaming-purple/80"
                >
                  Player 2 Attack
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Turn indicator */}
        <div className="absolute top-4 right-4">
          <Badge className={
            gameState.turn === 'player' ? 'bg-gaming-green' : 
            gameState.turn === 'player2' ? 'bg-gaming-purple' : 'bg-gaming-red'
          }>
            {gameState.turn === 'player' ? (gameMode === 'multiplayer' ? 'Player 1 Turn' : 'Your Turn') : 
             gameState.turn === 'player2' ? 'Player 2 Turn' : 'Enemy Turn'}
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

      {/* Item Shop */}
      <ItemShop
        isOpen={gameState.shopOpen}
        onClose={() => setGameState(prev => ({ ...prev, shopOpen: false }))}
        character={gameState.turn === 'player2' && gameState.player2 ? gameState.player2 : gameState.player}
        onPurchase={(item) => handleItemPurchase(item, gameState.turn === 'player2')}
      />
    </div>
  );
};