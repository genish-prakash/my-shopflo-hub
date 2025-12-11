import { ArrowLeft, LogOut, Phone, Mail, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Profile = () => {
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

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center gap-3 px-4 h-14">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Account and Login</h1>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-card px-4 py-8">
        <div className="flex flex-col items-center text-center">
          <Avatar className="w-20 h-20 mb-4">
            <AvatarFallback className="bg-neutral-200 text-neutral-600 text-2xl font-semibold">
              <User className="w-10 h-10" />
            </AvatarFallback>
          </Avatar>
          <h1 className="text-xl font-bold text-foreground mb-1">Rahul Kumar</h1>
        </div>
      </div>

      {/* Contact Details */}
      <div className="bg-card mx-4 mt-4 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Contact Details</p>
        </div>
        
        <div className="divide-y divide-border">
          <div className="flex items-center gap-4 px-4 py-4">
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
              <Mail className="h-5 w-5 text-neutral-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-0.5">Email</p>
              <p className="text-sm font-medium text-foreground">rahul.kumar@email.com</p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-4 py-4">
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
              <Phone className="h-5 w-5 text-neutral-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-0.5">Phone</p>
              <p className="text-sm font-medium text-foreground">+91 98765 43210</p>
            </div>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="bg-card mx-4 mt-4 rounded-2xl overflow-hidden">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-4 hover:bg-muted/50 transition-colors"
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
      <p className="text-center text-xs text-muted-foreground mt-6">Version 1.0.0</p>
    </div>
  );
};

export default Profile;
