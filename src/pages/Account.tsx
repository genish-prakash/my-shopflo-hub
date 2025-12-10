import { User, SlidersHorizontal, MapPin, Shield, Bell, LogOut, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import wanderLogo from "@/assets/wander-logo.png";

const Account = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
    toast({
      title: "Logged out successfully",
      description: "See you again soon!",
    });
  };

  const menuItems = [
    {
      icon: User,
      label: "Account and Login",
      description: "Manage your account details",
      onClick: () => {},
    },
    {
      icon: SlidersHorizontal,
      label: "Shopping Preferences",
      description: "Customize your shopping experience",
      onClick: () => navigate('/shopping-preferences'),
    },
    {
      icon: MapPin,
      label: "My Addresses",
      description: "Manage delivery addresses",
      onClick: () => {},
    },
    {
      icon: Shield,
      label: "Privacy and Consent",
      description: "Manage your privacy settings",
      onClick: () => {},
    },
    {
      icon: Bell,
      label: "Notifications",
      description: "Manage notification preferences",
      onClick: () => navigate('/notifications'),
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm safe-top">
        <div className="flex items-center justify-between h-12 px-4">
          <button 
            onClick={() => navigate('/home')}
            className="flex items-center gap-2"
          >
            <img src={wanderLogo} alt="Wander" className="h-7 w-7 rounded-lg" />
            <span className="text-sm font-semibold text-foreground">Wander</span>
          </button>
        </div>
      </header>

      {/* Profile Section */}
      <div className="bg-card px-4 py-6">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-neutral-200 text-neutral-600 text-xl font-semibold">
              RK
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-lg font-bold text-foreground">Rahul Kumar</h1>
            <p className="text-sm text-muted-foreground">rahul.kumar@email.com</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 py-4 space-y-3">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="w-full bg-card rounded-2xl p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors shadow-sm"
          >
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
              <item.icon className="h-5 w-5 text-neutral-500" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        ))}
      </div>

      {/* Logout Button */}
      <div className="px-4 pt-2 pb-8">
        <button
          onClick={handleLogout}
          className="w-full bg-card rounded-2xl p-4 flex items-center gap-4 hover:bg-red-50 transition-colors shadow-sm"
        >
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
            <LogOut className="h-5 w-5 text-red-500" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium text-red-500">Logout</p>
            <p className="text-xs text-muted-foreground">Sign out of your account</p>
          </div>
        </button>
      </div>

      {/* App Version */}
      <p className="text-center text-xs text-muted-foreground pb-6">Version 1.0.0</p>
    </div>
  );
};

export default Account;
