import { useState } from 'react';
import { Character, Item } from '@/types/game';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Coins, Sword, Shield, Heart, Zap, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ItemShopProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  onPurchase: (item: Item) => void;
}

const SHOP_ITEMS: Item[] = [
  {
    id: 'sword',
    name: 'Iron Sword',
    cost: 50,
    type: 'equipment',
    stats: { attack: 15 },
    description: 'A sturdy iron blade that increases attack power',
    icon: '⚔️'
  },
  {
    id: 'armor',
    name: 'Chain Mail',
    cost: 60,
    type: 'equipment',
    stats: { defense: 12 },
    description: 'Protective chain mail that reduces incoming damage',
    icon: '🛡️'
  },
  {
    id: 'critical-blade',
    name: 'Critical Blade',
    cost: 90,
    type: 'equipment',
    stats: { attack: 10, criticalChance: 25 },
    description: 'A razor-sharp blade with high critical hit chance',
    icon: '🗡️'
  },
  {
    id: 'health-potion',
    name: 'Health Potion',
    cost: 25,
    type: 'consumable',
    stats: {},
    effects: { heal: 50 },
    description: 'Instantly restores 50 health when used',
    icon: '🧪'
  },
  {
    id: 'mana-potion',
    name: 'Mana Potion',
    cost: 20,
    type: 'consumable',
    stats: {},
    effects: { manaRestore: 40 },
    description: 'Instantly restores 40 mana when used',
    icon: '🔮'
  },
  {
    id: 'poison-vial',
    name: 'Poison Vial',
    cost: 35,
    type: 'consumable',
    stats: {},
    effects: { 
      statusEffect: { type: 'poison', duration: 3, value: 10 }
    },
    description: 'Applies poison to your next attack (10 damage per turn for 3 turns)',
    icon: '🧪'
  },
  {
    id: 'crystal',
    name: 'Mana Crystal',
    cost: 30,
    type: 'equipment',
    stats: { mana: 40 },
    description: 'Increases maximum mana capacity',
    icon: '💎'
  },
  {
    id: 'ring',
    name: 'Power Ring',
    cost: 80,
    type: 'equipment',
    stats: { attack: 10, defense: 8 },
    description: 'A magical ring that enhances both offense and defense',
    icon: '💍'
  },
  {
    id: 'boots',
    name: 'Swift Boots',
    cost: 40,
    type: 'equipment',
    stats: { health: 20, mana: 20 },
    description: 'Lightweight boots that boost vitality',
    icon: '👢'
  }
];

export const ItemShop = ({ isOpen, onClose, character, onPurchase }: ItemShopProps) => {
  const { toast } = useToast();
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const handlePurchase = (item: Item) => {
    if (character.gold < item.cost) {
      toast({
        title: "Insufficient Gold",
        description: `You need ${item.cost - character.gold} more gold to buy this item.`,
        variant: "destructive"
      });
      return;
    }

    onPurchase(item);
    toast({
      title: "Item Purchased!",
      description: `${item.name} has been added to your inventory.`,
    });
  };

  const getStatIcon = (stat: string) => {
    switch (stat) {
      case 'attack': return <Sword className="w-4 h-4" />;
      case 'defense': return <Shield className="w-4 h-4" />;
      case 'health': return <Heart className="w-4 h-4" />;
      case 'mana': return <Zap className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gaming-blue">
            <ShoppingCart className="w-6 h-6" />
            Item Shop
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Gold Display */}
          <Card className="p-4 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30">
            <div className="flex items-center gap-2">
              <Coins className="w-6 h-6 text-yellow-500" />
              <span className="text-xl font-bold text-yellow-500">{character.gold} Gold</span>
            </div>
          </Card>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SHOP_ITEMS.map((item) => {
              const canAfford = character.gold >= item.cost;
              const alreadyOwned = character.items.some(ownedItem => ownedItem.id === item.id);

              return (
                <Card 
                  key={item.id}
                  className={`p-4 cursor-pointer transition-all duration-200 ${
                    selectedItem?.id === item.id 
                      ? 'ring-2 ring-gaming-blue shadow-glow-primary' 
                      : 'hover:shadow-glow-secondary'
                  } ${!canAfford ? 'opacity-50' : ''}`}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="text-center space-y-3">
                    <div className="text-4xl mb-2">{item.icon}</div>
                    <h3 className="font-semibold text-gaming-blue">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    
                    {/* Stats */}
                    <div className="flex flex-wrap gap-1 justify-center">
                      {Object.entries(item.stats).map(([stat, value]) => (
                        <Badge key={stat} variant="outline" className="text-xs">
                          <span className="flex items-center gap-1">
                            {getStatIcon(stat)}
                            +{value}
                          </span>
                        </Badge>
                      ))}
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-center gap-2">
                      <Coins className="w-4 h-4 text-yellow-500" />
                      <span className={`font-bold ${canAfford ? 'text-yellow-500' : 'text-red-500'}`}>
                        {item.cost}
                      </span>
                    </div>

                    {/* Purchase Button */}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePurchase(item);
                      }}
                      disabled={!canAfford || alreadyOwned}
                      className="w-full"
                      variant={canAfford && !alreadyOwned ? "default" : "outline"}
                    >
                      {alreadyOwned ? "Owned" : canAfford ? "Buy" : "Can't Afford"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};