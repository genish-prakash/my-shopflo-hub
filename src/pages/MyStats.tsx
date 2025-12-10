import { ArrowLeft, TrendingUp, Award, Percent, Package, Calendar, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const MyStats = () => {
  const navigate = useNavigate();

  const stats = {
    totalSpent: "₹1,24,567",
    totalOrders: 23,
    rewardsEarned: "₹8,450",
    discountsSaved: "₹15,230",
    favoriteCategory: "Electronics",
    joinedDate: "Jan 2023",
    yearlySpending: [
      { month: "Jan", amount: 12000 },
      { month: "Feb", amount: 8500 },
      { month: "Mar", amount: 15000 },
      { month: "Apr", amount: 9200 },
      { month: "May", amount: 11000 },
      { month: "Jun", amount: 13500 },
    ],
  };

  const maxSpending = Math.max(...stats.yearlySpending.map(s => s.amount));

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3 px-4 h-16">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Your 2024 Wrapped</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6 max-w-2xl mx-auto">
        {/* Hero Card */}
        <Card className="bg-gradient-primary p-8 text-center text-primary-foreground animate-fade-in">
          <div className="space-y-2">
            <Sparkles className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold">Your Year in Shopping</h2>
            <p className="text-primary-foreground/80">
              Member since {stats.joinedDate}
            </p>
          </div>
        </Card>

        {/* Total Spent */}
        <Card className="p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-3xl font-bold text-foreground">{stats.totalSpent}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Across <span className="font-semibold text-foreground">{stats.totalOrders} orders</span> this year
          </p>
        </Card>

        {/* Rewards & Savings */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-5 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.rewardsEarned}</p>
                <p className="text-xs text-muted-foreground">Rewards Earned</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                <Percent className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.discountsSaved}</p>
                <p className="text-xs text-muted-foreground">Saved in Discounts</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Monthly Spending */}
        <Card className="p-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Monthly Spending</h3>
          </div>
          <div className="space-y-3">
            {stats.yearlySpending.map((item, index) => (
              <div key={item.month} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.month}</span>
                  <span className="font-semibold text-foreground">₹{item.amount.toLocaleString()}</span>
                </div>
                <Progress 
                  value={(item.amount / maxSpending) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Favorite Category */}
        <Card className="p-6 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
              <Package className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Your favorite category</p>
              <p className="text-2xl font-bold text-foreground">{stats.favoriteCategory}</p>
              <p className="text-sm text-muted-foreground">Most ordered in 2024</p>
            </div>
          </div>
        </Card>

        {/* Fun Fact */}
        <Card className="p-6 bg-gradient-to-br from-accent/20 to-primary/10 border-primary/20 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <div className="text-center space-y-2">
            <div className="text-4xl">🎉</div>
            <h3 className="font-bold text-lg text-foreground">That's Amazing!</h3>
            <p className="text-sm text-muted-foreground">
              You saved <span className="font-bold text-foreground">{stats.discountsSaved}</span> in discounts. 
              That's like getting <span className="font-bold text-foreground">3 orders for free!</span>
            </p>
          </div>
        </Card>

        {/* Share Button */}
        <Button className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 transition-smooth">
          <Sparkles className="h-4 w-4 mr-2" />
          Share Your Stats
        </Button>
      </div>
    </div>
  );
};

export default MyStats;
