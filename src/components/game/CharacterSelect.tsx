import { useState } from 'react';
import { Character } from '@/types/game';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Sword, Heart, Star } from 'lucide-react';

interface CharacterSelectProps {
  onCharacterSelect: (character: Character) => void;
  gameMode?: 'single' | 'multiplayer';
  selectedCharacter?: Character | null;
}

const CHARACTERS: Omit<Character, 'x' | 'y' | 'currentHealth' | 'currentMana' | 'gold' | 'items'>[] = [
  {
    id: 'warrior',
    name: 'Steel Guardian',
    role: 'Tank',
    maxHealth: 150,
    maxMana: 60,
    attack: 20,
    defense: 25,
    criticalChance: 10,
    abilities: [
      {
        id: 'shield-bash',
        name: 'Shield Bash',
        manaCost: 20,
        damage: 25,
        statusEffect: { type: 'freeze', duration: 1, value: 0 },
        description: 'Stuns enemy for 1 turn',
        icon: '🛡️'
      },
      {
        id: 'defensive-stance',
        name: 'Defensive Stance',
        manaCost: 15,
        heal: 30,
        statusEffect: { type: 'shield', duration: 2, value: 10 },
        description: 'Heals and reduces damage taken',
        icon: '🛡️'
      }
    ],
    statusEffects: []
  },
  {
    id: 'assassin',
    name: 'Shadow Blade',
    role: 'DPS',
    maxHealth: 80,
    maxMana: 100,
    attack: 35,
    defense: 10,
    criticalChance: 35,
    abilities: [
      {
        id: 'backstab',
        name: 'Backstab',
        manaCost: 25,
        damage: 45,
        description: 'High damage critical strike',
        icon: '🗡️'
      },
      {
        id: 'poison-blade',
        name: 'Poison Blade',
        manaCost: 20,
        damage: 20,
        statusEffect: { type: 'poison', duration: 3, value: 10 },
        description: 'Applies poison for 3 turns',
        icon: '☠️'
      }
    ],
    statusEffects: []
  },
  {
    id: 'healer',
    name: 'Divine Oracle',
    role: 'Support',
    maxHealth: 100,
    maxMana: 120,
    attack: 15,
    defense: 18,
    criticalChance: 20,
    abilities: [
      {
        id: 'fireball',
        name: 'Fireball',
        manaCost: 30,
        damage: 35,
        statusEffect: { type: 'burn', duration: 2, value: 15 },
        description: 'Burns enemy for 2 turns',
        icon: '🔥'
      },
      {
        id: 'heal',
        name: 'Healing Light',
        manaCost: 25,
        heal: 50,
        description: 'Restores health',
        icon: '✨'
      }
    ],
    statusEffects: []
  }
];

export const CharacterSelect = ({ onCharacterSelect, gameMode = 'single', selectedCharacter: existingSelection }: CharacterSelectProps) => {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);

  const getRoleIcon = (role: Character['role']) => {
    switch (role) {
      case 'Tank':
        return <Shield className="w-6 h-6" />;
      case 'DPS':
        return <Sword className="w-6 h-6" />;
      case 'Support':
        return <Heart className="w-6 h-6" />;
    }
  };

  const getRoleColor = (role: Character['role']) => {
    switch (role) {
      case 'Tank':
        return 'border-gaming-blue bg-gaming-blue/10 text-gaming-blue';
      case 'DPS':
        return 'border-gaming-red bg-gaming-red/10 text-gaming-red';
      case 'Support':
        return 'border-gaming-green bg-gaming-green/10 text-gaming-green';
    }
  };

  const handleSelect = (character: Omit<Character, 'x' | 'y' | 'currentHealth' | 'currentMana' | 'gold' | 'items'>) => {
    const fullCharacter: Character = {
      ...character,
      x: 100,
      y: 300,
      currentHealth: character.maxHealth,
      currentMana: character.maxMana,
      gold: 0,
      items: []
    };
    onCharacterSelect(fullCharacter);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
          Choose Your Champion
        </h2>
        <p className="text-muted-foreground">
          Select a character to enter the battle arena
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CHARACTERS.map((character) => (
          <Card 
            key={character.id}
            className={`
              p-6 cursor-pointer transition-all duration-300 hover:shadow-glow-primary
              ${selectedCharacterId === character.id ? 'ring-2 ring-primary shadow-glow-primary' : ''}
              ${existingSelection?.id === character.id ? 'ring-2 ring-gaming-blue opacity-50' : ''}
            `}
            onClick={() => setSelectedCharacterId(character.id)}
          >
            <div className="text-center space-y-4">
              <div className={`
                w-20 h-20 mx-auto rounded-full border-4 flex items-center justify-center
                ${getRoleColor(character.role)}
              `}>
                {getRoleIcon(character.role)}
              </div>

              <div>
                <h3 className="text-xl font-bold">{character.name}</h3>
                <Badge className={getRoleColor(character.role)}>
                  {character.role}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-muted rounded p-2">
                  <div className="text-muted-foreground">Health</div>
                  <div className="font-bold text-gaming-green">{character.maxHealth}</div>
                </div>
                <div className="bg-muted rounded p-2">
                  <div className="text-muted-foreground">Mana</div>
                  <div className="font-bold text-gaming-blue">{character.maxMana}</div>
                </div>
                <div className="bg-muted rounded p-2">
                  <div className="text-muted-foreground">Attack</div>
                  <div className="font-bold text-gaming-red">{character.attack}</div>
                </div>
                <div className="bg-muted rounded p-2">
                  <div className="text-muted-foreground">Defense</div>
                  <div className="font-bold text-gaming-purple">{character.defense}</div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-muted-foreground">
                {character.role === 'Tank' && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    High defense, good health, protects team
                  </div>
                )}
                {character.role === 'DPS' && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    High damage, fast attacks, glass cannon
                  </div>
                )}
                {character.role === 'Support' && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Healing abilities, high mana, team utility
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedCharacterId && (
        <div className="text-center">
          <Button 
            onClick={() => {
              const character = CHARACTERS.find(c => c.id === selectedCharacterId);
              if (character) handleSelect(character);
            }}
            className="bg-gradient-primary hover:shadow-glow-primary px-8 py-3 text-lg font-semibold"
          >
            Enter Battle Arena
          </Button>
        </div>
      )}
    </div>
  );
};