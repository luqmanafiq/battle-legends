import { useState } from 'react';
import { Character, GameStats } from '@/types/game';
import { CharacterSelect } from './CharacterSelect';
import { GameArena } from './GameArena';
import { GameStatsComponent } from './GameStats';
import { GameModeSelector } from './GameModeSelector';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Play, BarChart3, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type GamePhase = 'menu' | 'mode-select' | 'character-select' | 'battle' | 'results';

export const MobaGame = () => {
  const { toast } = useToast();
  const [gamePhase, setGamePhase] = useState<GamePhase>('menu');
  const [gameMode, setGameMode] = useState<'single' | 'multiplayer'>('single');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [selectedCharacter2, setSelectedCharacter2] = useState<Character | null>(null);
  const [gameStats, setGameStats] = useState<GameStats>({
    gamesPlayed: 0,
    gamesWon: 0,
    totalDamageDealt: 0,
    totalDamageTaken: 0,
    averageTurnsPerGame: 0
  });
  const [lastGameResult, setLastGameResult] = useState<{
    winner: 'player' | 'ai';
    stats: any;
  } | null>(null);

  const handleModeSelect = (mode: 'single' | 'multiplayer') => {
    setGameMode(mode);
    setGamePhase('character-select');
  };

  const handleCharacterSelect = (character: Character, isPlayer2 = false) => {
    // Add starting gold to character
    const characterWithGold = { ...character, gold: 100, items: [] };
    
    if (gameMode === 'multiplayer' && !isPlayer2 && !selectedCharacter) {
      setSelectedCharacter(characterWithGold);
      toast({
        title: "Player 1 Selected!",
        description: `${character.name} joins the arena`,
      });
    } else if (gameMode === 'multiplayer' && isPlayer2) {
      setSelectedCharacter2(characterWithGold);
      setGamePhase('battle');
      toast({
        title: "Player 2 Selected!",
        description: `${character.name} enters the arena. Let the battle begin!`,
      });
    } else {
      setSelectedCharacter(characterWithGold);
      setGamePhase('battle');
      toast({
        title: "Character Selected!",
        description: `${character.name} enters the arena`,
      });
    }
  };

  const handleGameEnd = (winner: 'player' | 'ai', matchStats: any) => {
    const isWin = winner === 'player';
    
    setGameStats(prev => ({
      gamesPlayed: prev.gamesPlayed + 1,
      gamesWon: prev.gamesWon + (isWin ? 1 : 0),
      totalDamageDealt: prev.totalDamageDealt + (matchStats.damageDealt || 0),
      totalDamageTaken: prev.totalDamageTaken + (matchStats.damageTaken || 0),
      averageTurnsPerGame: ((prev.averageTurnsPerGame * prev.gamesPlayed) + (matchStats.turnsPlayed || 0)) / (prev.gamesPlayed + 1)
    }));

    setLastGameResult({ winner, stats: matchStats });
    setGamePhase('results');

    toast({
      title: isWin ? "Victory!" : "Defeat!",
      description: isWin ? "You have triumphed in battle!" : "Better luck next time, warrior!",
    });
  };

  const renderMainMenu = () => (
    <div className="space-y-8 text-center">
      <div>
        <h1 className="text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Arena Legends
        </h1>
        <p className="text-xl text-muted-foreground mb-2">
          A MOBA-style battle arena game
        </p>
        <Badge variant="outline" className="border-gaming-purple text-gaming-purple">
          Web Technology Demo
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <Card className="p-6 hover:shadow-glow-primary transition-all duration-300 cursor-pointer" 
              onClick={() => setGamePhase('mode-select')}>
          <Play className="w-12 h-12 mx-auto mb-4 text-gaming-green" />
          <h3 className="text-xl font-semibold mb-2">Start Battle</h3>
          <p className="text-muted-foreground">Choose game mode and enter combat</p>
        </Card>

        <Card className="p-6 hover:shadow-glow-secondary transition-all duration-300">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gaming-blue" />
          <h3 className="text-xl font-semibold mb-2">View Stats</h3>
          <p className="text-muted-foreground">
            Games: {gameStats.gamesPlayed} | 
            Wins: {gameStats.gamesWon} |
            Rate: {gameStats.gamesPlayed > 0 ? (gameStats.gamesWon / gameStats.gamesPlayed * 100).toFixed(0) : 0}%
          </p>
        </Card>
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Game Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <h4 className="font-semibold text-gaming-blue mb-2">Strategic Combat</h4>
            <p className="text-sm text-muted-foreground">Turn-based battles with items and equipment</p>
          </Card>
          <Card className="p-4">
            <h4 className="font-semibold text-gaming-purple mb-2">Item Shop System</h4>
            <p className="text-sm text-muted-foreground">Buy weapons, armor, and consumables with gold</p>
          </Card>
          <Card className="p-4">
            <h4 className="font-semibold text-gaming-pink mb-2">Multiplayer Mode</h4>
            <p className="text-sm text-muted-foreground">Local multiplayer battles and analytics tracking</p>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="space-y-6 text-center">
      <div>
        <div className={`text-6xl font-bold mb-4 ${
          lastGameResult?.winner === 'player' ? 'text-gaming-green' : 'text-gaming-red'
        }`}>
          {lastGameResult?.winner === 'player' ? 'VICTORY!' : 'DEFEAT!'}
        </div>
        {lastGameResult?.winner === 'player' && (
          <Trophy className="w-16 h-16 mx-auto text-gaming-green mb-4" />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
        <Card className="p-4">
          <div className="text-2xl font-bold text-gaming-blue">
            {gameStats.gamesPlayed}
          </div>
          <div className="text-sm text-muted-foreground">Total Games</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-gaming-green">
            {gameStats.gamesWon}
          </div>
          <div className="text-sm text-muted-foreground">Games Won</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-gaming-purple">
            {gameStats.gamesPlayed > 0 ? (gameStats.gamesWon / gameStats.gamesPlayed * 100).toFixed(0) : 0}%
          </div>
          <div className="text-sm text-muted-foreground">Win Rate</div>
        </Card>
      </div>

      <div className="space-y-4">
        <Button 
          onClick={() => setGamePhase('character-select')}
          className="bg-gradient-primary hover:shadow-glow-primary"
        >
          Play Again
        </Button>
        <div>
          <Button 
            variant="outline" 
            onClick={() => setGamePhase('menu')}
            className="border-gaming-blue text-gaming-blue hover:bg-gaming-blue/10"
          >
            <Home className="w-4 h-4 mr-2" />
            Main Menu
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {gamePhase === 'menu' && (
          <Tabs defaultValue="game" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="game">Game</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>
            <TabsContent value="game">
              {renderMainMenu()}
            </TabsContent>
            <TabsContent value="stats">
              <GameStatsComponent stats={gameStats} />
            </TabsContent>
          </Tabs>
        )}

        {gamePhase === 'mode-select' && (
          <GameModeSelector 
            onModeSelect={handleModeSelect}
            onBack={() => setGamePhase('menu')}
          />
        )}

        {gamePhase === 'character-select' && (
          <div>
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={() => setGamePhase('mode-select')}
                className="border-gaming-blue text-gaming-blue hover:bg-gaming-blue/10"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Mode Select
              </Button>
            </div>
            
            {gameMode === 'multiplayer' && (
              <div className="mb-4 text-center">
                <Badge className="bg-gaming-purple">
                  {!selectedCharacter ? "Player 1 - Choose Your Character" : 
                   !selectedCharacter2 ? "Player 2 - Choose Your Character" : "Ready to Battle!"}
                </Badge>
              </div>
            )}
            
            <CharacterSelect 
              onCharacterSelect={(char) => handleCharacterSelect(char, gameMode === 'multiplayer' && !!selectedCharacter)}
              gameMode={gameMode}
              selectedCharacter={selectedCharacter}
            />
          </div>
        )}

        {gamePhase === 'battle' && (
          <div>
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={() => setGamePhase('character-select')}
                className="border-gaming-blue text-gaming-blue hover:bg-gaming-blue/10"
              >
                Change Character
              </Button>
            </div>
            <GameArena 
              selectedCharacter={selectedCharacter}
              selectedCharacter2={selectedCharacter2}
              gameMode={gameMode}
              onGameEnd={handleGameEnd}
            />
          </div>
        )}

        {gamePhase === 'results' && renderResults()}
      </div>
    </div>
  );
};