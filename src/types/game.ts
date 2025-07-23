export interface Item {
  id: string;
  name: string;
  cost: number;
  stats: {
    attack?: number;
    defense?: number;
    health?: number;
    mana?: number;
  };
  description: string;
  icon: string;
}

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
  gold: number;
  items: Item[];
}

export interface GameState {
  player: Character | null;
  player2?: Character | null; // For local multiplayer
  ai: Character;
  gamePhase: 'setup' | 'combat' | 'ended';
  turn: 'player' | 'player2' | 'ai';
  actionLog: string[];
  gameMode: 'single' | 'multiplayer';
  shopOpen: boolean;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  totalDamageDealt: number;
  totalDamageTaken: number;
  averageTurnsPerGame: number;
}