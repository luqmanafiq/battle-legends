export interface Character {
  id: string;
  name: string;
  role: 'Tank' | 'DPS' | 'Support';
  maxHealth: number;
  currentHealth: number;
  maxMana: number;
  currentMana: number;
  attack: number;
  defense: number;
  x: number;
  y: number;
}

export interface GameState {
  player: Character | null;
  ai: Character;
  gamePhase: 'setup' | 'combat' | 'ended';
  turn: 'player' | 'ai';
  actionLog: string[];
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  totalDamageDealt: number;
  totalDamageTaken: number;
  averageTurnsPerGame: number;
}