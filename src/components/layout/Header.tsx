import { User, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ViewType } from "@/pages/Home";
import wanderLogo from "@/assets/wander-logo.png";

interface HeaderProps {
  onViewChange: (view: ViewType) => void;
}

const Header = ({ onViewChange }: HeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm safe-top">
      <div className="flex items-center justify-between h-12 px-4">
        {/* Logo - Left Side */}
        <div className="flex items-center gap-2">
          <img src={wanderLogo} alt="Wander" className="h-7 w-7 rounded-lg" />
          <span className="text-sm font-semibold text-foreground">Wander</span>
        </div>

        {/* Right Side - Notifications & Profile */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button 
            onClick={() => navigate('/notifications')}
            className="relative p-2 rounded-full hover:bg-muted transition-colors"
          >
            <Bell className="h-5 w-5 text-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Profile - Navigate to Account Page */}
          <button
            onClick={() => navigate('/account')}
            className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full"
          >
            <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-neutral-200 hover:ring-neutral-300 transition-all">
              <AvatarFallback className="bg-neutral-200 text-neutral-600 font-semibold text-xs">
                RK
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;