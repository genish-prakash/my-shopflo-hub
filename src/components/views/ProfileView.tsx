import { User, ChevronRight, LogOut, Settings, HelpCircle, FileText, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ProfileView = () => {
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
      label: "Shopping Preferences",
      description: "Manage your preferences",
      icon: Settings,
      onClick: () => navigate("/shopping-preferences"),
    },
    {
      label: "Help Center",
      description: "FAQs and support",
      icon: HelpCircle,
      onClick: () => toast({ title: "Coming soon", description: "Help center is under development" }),
    },
    {
      label: "Terms & Conditions",
      description: "Read our terms",
      icon: FileText,
      onClick: () => toast({ title: "Coming soon", description: "Terms page is under development" }),
    },
    {
      label: "Privacy Policy",
      description: "How we use your data",
      icon: Shield,
      onClick: () => toast({ title: "Coming soon", description: "Privacy page is under development" }),
    },
  ];

  return (
    <div className="pb-24">
      {/* Profile Header */}
      <div className="bg-card px-4 py-6 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">Rahul Kumar</h1>
            <p className="text-sm text-muted-foreground">rahul.kumar@email.com</p>
            <p className="text-sm text-muted-foreground">+91 98765 43210</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-card">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              onClick={item.onClick}
              className={`flex items-center gap-4 px-4 py-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                index !== menuItems.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          );
        })}
      </div>

      {/* Logout */}
      <div className="bg-card mt-4">
        <div
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-4 cursor-pointer hover:bg-muted/50 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
            <LogOut className="h-5 w-5 text-destructive" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-destructive">Logout</p>
            <p className="text-sm text-muted-foreground">Sign out of your account</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      {/* App Version */}
      <p className="text-center text-xs text-muted-foreground mt-6">Version 1.0.0</p>
    </div>
  );
};

export default ProfileView;