import { Trophy, Coins, Gift, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockRewards = [
  {
    id: "1",
    brand: "Nike Store",
    logo: "🏃",
    points: 1250,
    cashback: 450,
    tier: "Gold",
    nextReward: 750,
    website: "https://nike.com",
  },
  {
    id: "2",
    brand: "Apple Store",
    logo: "🍎",
    points: 3200,
    cashback: 1200,
    tier: "Platinum",
    nextReward: 800,
    website: "https://apple.com",
  },
  {
    id: "3",
    brand: "Zara Fashion",
    logo: "👔",
    points: 890,
    cashback: 320,
    tier: "Silver",
    nextReward: 610,
    website: "https://zara.com",
  },
];

const RewardsView = () => {
  const totalCashback = mockRewards.reduce((sum, r) => sum + r.cashback, 0);

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground mb-1">Rewards</h1>
        <p className="text-sm text-muted-foreground">Loyalty points across all brands</p>
      </div>

      {/* Total Cashback Card */}
      <div className="bg-gradient-primary rounded-xl p-6 text-primary-foreground shadow-card mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-12 w-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <Coins className="h-6 w-6" />
          </div>
          <div>
            <span className="text-sm font-medium opacity-90">Total Cashback</span>
            <p className="text-4xl font-bold">₹{totalCashback}</p>
          </div>
        </div>
        <p className="text-sm opacity-90">Available to redeem across all brands</p>
      </div>

      {/* Brand-wise Rewards */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Brand Rewards</h2>
        {mockRewards.map((reward) => (
          <div
            key={reward.id}
            className="bg-card rounded-xl shadow-card hover:shadow-card-hover transition-smooth p-4"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center text-2xl">
                {reward.logo}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{reward.brand}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-primary text-primary-foreground">
                    {reward.tier}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Member since Jan 2024</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Points</span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {reward.points.toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-accent" />
                  <span className="text-xs text-muted-foreground">Cashback</span>
                </div>
                <p className="text-2xl font-bold text-foreground">₹{reward.cashback}</p>
              </div>
            </div>

            {/* Progress to next reward */}
            <div className="space-y-2 pt-4 border-t border-border">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Next reward in</span>
                </div>
                <span className="font-medium text-foreground">
                  {reward.nextReward} points
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-primary transition-smooth"
                  style={{
                    width: `${Math.min(
                      ((reward.points % 1000) / 1000) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Redeem Button */}
            <Button
              className="w-full mt-4 bg-gradient-primary text-primary-foreground hover:opacity-90 transition-smooth"
              onClick={() => window.open(reward.website, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Redeem Now
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardsView;
