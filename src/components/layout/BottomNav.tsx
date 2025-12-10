import { ShoppingBag, Grid3X3, Store, Award, Tag } from "lucide-react";
import { ViewType } from "@/pages/Home";

interface BottomNavProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const BottomNav = ({ currentView, onViewChange }: BottomNavProps) => {
  const navItems = [
    { id: "brands" as ViewType, label: "Brands", icon: Store },
    { id: "orders" as ViewType, label: "Orders", icon: ShoppingBag },
    { id: "offers" as ViewType, label: "Offers", icon: Tag },
    { id: "products" as ViewType, label: "Products", icon: Grid3X3 },
    { id: "rewards" as ViewType, label: "Rewards", icon: Award },
  ];

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50">
      <div className="bg-card/95 backdrop-blur-lg rounded-2xl shadow-lg border border-border/50 mx-auto max-w-md">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`relative flex flex-col items-center justify-center flex-1 h-full min-w-[56px] transition-all duration-200 ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground active:text-foreground"
                }`}
              >
                {isActive && (
                  <div className="absolute inset-x-1 inset-y-1 bg-primary/10 rounded-xl" />
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