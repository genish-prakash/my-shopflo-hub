import { User, Settings, Shield, SlidersHorizontal, MapPin, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ViewType } from "@/pages/Home";
import shopPassLogo from "@/assets/shop-pass-logo.svg";

interface HeaderProps {
  onViewChange: (view: ViewType) => void;
}

const Header = ({ onViewChange }: HeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm safe-top">
      <div className="flex items-center justify-between h-14 md:h-16 px-4">
        {/* Logo */}
        <div className="flex items-center">
          <img src={shopPassLogo} alt="Shop Pass" className="h-6 md:h-7" />
        </div>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full">
            <Avatar className="h-10 w-10 cursor-pointer ring-2 ring-primary/20 hover:ring-primary transition-smooth">
              <AvatarImage src="" alt="Profile" />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                RK
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-56 bg-card border-border z-[100]"
          >
            <div className="px-2 py-3 border-b border-border">
              <p className="text-sm font-medium text-foreground">Rahul Kumar</p>
              <p className="text-xs text-muted-foreground">rahul.kumar@email.com</p>
            </div>
            
            <DropdownMenuItem 
              onClick={() => onViewChange("profile")}
              className="cursor-pointer py-2.5"
            >
              <User className="mr-2 h-4 w-4 text-primary" />
              <span>Profile</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => navigate('/shopping-preferences')}
              className="cursor-pointer py-2.5"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4 text-primary" />
              <span>Shopping Preferences</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => onViewChange("addresses")}
              className="cursor-pointer py-2.5"
            >
              <MapPin className="mr-2 h-4 w-4 text-primary" />
              <span>My Addresses</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => navigate('/my-stats')}
              className="cursor-pointer py-2.5"
            >
              <BarChart3 className="mr-2 h-4 w-4 text-primary" />
              <span>My Stats</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem className="cursor-pointer py-2.5">
              <Shield className="mr-2 h-4 w-4 text-primary" />
              <span>Privacy & Consent</span>
            </DropdownMenuItem>
            
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="cursor-pointer py-2.5">
              <Settings className="mr-2 h-4 w-4 text-primary" />
              <span>My Shop Pass Settings</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
