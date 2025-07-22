import { Character } from '@/types/game';
import { Badge } from '@/components/ui/badge';
import { Shield, Sword, Heart, Zap } from 'lucide-react';

interface CharacterTokenProps {
  character: Character;
  isPlayer: boolean;
  isActive: boolean;
}

export const CharacterToken = ({ character, isPlayer, isActive }: CharacterTokenProps) => {
  const getRoleIcon = (role: Character['role']) => {
    switch (role) {
      case 'Tank':
        return <Shield className="w-4 h-4" />;
      case 'DPS':
        return <Sword className="w-4 h-4" />;
      case 'Support':
        return <Heart className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: Character['role']) => {
    switch (role) {
      case 'Tank':
        return 'bg-gaming-blue';
      case 'DPS':
        return 'bg-gaming-red';
      case 'Support':
        return 'bg-gaming-green';
    }
  };

  const healthPercentage = (character.currentHealth / character.maxHealth) * 100;
  const manaPercentage = (character.currentMana / character.maxMana) * 100;

  return (
    <div 
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
        isActive ? 'animate-pulse' : ''
      }`}
      style={{ left: character.x, top: character.y }}
    >
      {/* Character Avatar */}
      <div className={`
        w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl font-bold
        ${isPlayer ? 'border-gaming-blue bg-gaming-blue/20' : 'border-gaming-red bg-gaming-red/20'}
        ${isActive ? 'shadow-glow-primary' : ''}
      `}>
        {getRoleIcon(character.role)}
      </div>

      {/* Character Info */}
      <div className="mt-2 text-center min-w-20">
        <div className="text-xs font-semibold">{character.name}</div>
        <Badge className={`text-xs ${getRoleColor(character.role)}`}>
          {character.role}
        </Badge>
      </div>

      {/* Health Bar */}
      <div className="mt-1 w-20 bg-gray-700 rounded-full h-2">
        <div 
          className="bg-gaming-green h-2 rounded-full transition-all duration-300"
          style={{ width: `${healthPercentage}%` }}
        />
      </div>

      {/* Mana Bar */}
      <div className="mt-1 w-20 bg-gray-700 rounded-full h-1">
        <div 
          className="bg-gaming-blue h-1 rounded-full transition-all duration-300"
          style={{ width: `${manaPercentage}%` }}
        />
      </div>

      {/* Stats tooltip on hover */}
      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded p-2 text-xs opacity-0 hover:opacity-100 transition-opacity pointer-events-none z-10">
        <div>HP: {character.currentHealth}/{character.maxHealth}</div>
        <div>MP: {character.currentMana}/{character.maxMana}</div>
        <div>ATK: {character.attack} | DEF: {character.defense}</div>
      </div>
    </div>
  );
};