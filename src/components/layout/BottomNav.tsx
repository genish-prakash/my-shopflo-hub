import { ShoppingBag, Grid3X3, Store, Award, Tag } from "lucide-react";
import { ViewType } from "@/pages/Home";

interface BottomNavProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const BottomNav = ({ currentView, onViewChange }: BottomNavProps) => {
  const navItems = [
    { id: "orders" as ViewType, label: "Orders", icon: ShoppingBag },
    { id: "products" as ViewType, label: "Products", icon: Grid3X3 },
    { id: "brands" as ViewType, label: "Brands", icon: Store },
    { id: "rewards" as ViewType, label: "Rewards", icon: Award },
    { id: "offers" as ViewType, label: "Offers", icon: Tag },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-card-hover z-50 safe-bottom">
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex justify-around items-center h-16 touch-target">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`relative flex flex-col items-center justify-center flex-1 h-full min-w-[64px] touch-target transition-all duration-200 ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground active:text-foreground"
                }`}
              >
                {isActive && (
                  <div className="absolute inset-x-2 -top-1 h-14 bg-primary/10 backdrop-blur-sm rounded-2xl border border-primary/20" />
                )}
                <div className="relative z-10 flex flex-col items-center">
                  <Icon className={`h-5 w-5 mb-1 ${isActive ? "fill-primary" : ""}`} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
