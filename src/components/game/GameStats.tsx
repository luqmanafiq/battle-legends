import { GameStats } from '@/types/game';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Shield, Swords, Clock, TrendingUp } from 'lucide-react';

interface GameStatsProps {
  stats: GameStats;
}

export const GameStatsComponent = ({ stats }: GameStatsProps) => {
  const winRate = stats.gamesPlayed > 0 ? (stats.gamesWon / stats.gamesPlayed * 100).toFixed(1) : 0;

  const statItems = [
    {
      icon: Trophy,
      label: 'Games Won',
      value: stats.gamesWon,
      color: 'text-gaming-green'
    },
    {
      icon: Target,
      label: 'Games Played',
      value: stats.gamesPlayed,
      color: 'text-gaming-blue'
    },
    {
      icon: TrendingUp,
      label: 'Win Rate',
      value: `${winRate}%`,
      color: 'text-gaming-purple'
    },
    {
      icon: Swords,
      label: 'Total Damage Dealt',
      value: stats.totalDamageDealt,
      color: 'text-gaming-red'
    },
    {
      icon: Shield,
      label: 'Total Damage Taken',
      value: stats.totalDamageTaken,
      color: 'text-gaming-pink'
    },
    {
      icon: Clock,
      label: 'Avg Turns/Game',
      value: stats.averageTurnsPerGame.toFixed(1),
      color: 'text-gaming-blue'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
          Player Statistics
        </h2>
        <p className="text-muted-foreground">
          Your battle performance analytics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statItems.map((item, index) => (
          <Card key={index} className="p-6 text-center hover:shadow-glow-accent transition-all duration-300">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4 ${item.color}`}>
              <item.icon className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold mb-1">{item.value}</div>
            <div className="text-sm text-muted-foreground">{item.label}</div>
          </Card>
        ))}
      </div>

      {stats.gamesPlayed > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gaming-purple" />
            Performance Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-2">Battle Efficiency</div>
              <div className="flex items-center gap-2">
                <Badge 
                  className={
                    Number(winRate) >= 70 ? 'bg-gaming-green' :
                    Number(winRate) >= 50 ? 'bg-gaming-blue' : 'bg-gaming-red'
                  }
                >
                  {Number(winRate) >= 70 ? 'Elite' : 
                   Number(winRate) >= 50 ? 'Skilled' : 'Learning'}
                </Badge>
                <span className="text-sm">{winRate}% win rate</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">Combat Style</div>
              <div className="flex items-center gap-2">
                <Badge 
                  className={
                    stats.totalDamageDealt > stats.totalDamageTaken ? 'bg-gaming-red' : 'bg-gaming-blue'
                  }
                >
                  {stats.totalDamageDealt > stats.totalDamageTaken ? 'Aggressive' : 'Defensive'}
                </Badge>
                <span className="text-sm">
                  {(stats.totalDamageDealt / Math.max(stats.totalDamageTaken, 1)).toFixed(1)}:1 ratio
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};