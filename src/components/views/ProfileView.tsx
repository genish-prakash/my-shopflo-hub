import { User, Mail, Phone, Edit2, LogOut, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ProfileView = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Rahul Kumar",
    email: "rahul.kumar@email.com",
    phone: "+91 98765 43210",
  });

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
    toast({
      title: "Logged out successfully",
      description: "See you again soon!",
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your changes have been saved successfully",
    });
  };

  return (
    <div className="px-4 pt-6 pb-4">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Profile Avatar */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-3">
          <User className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">{profile.name}</h2>
        <p className="text-sm text-muted-foreground">{profile.email}</p>
      </div>

      {/* Personal Information */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-4 space-y-4 mb-6">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Personal Information
        </h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              Full Name
            </Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              disabled={!isEditing}
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="h-3 w-3" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              disabled={!isEditing}
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="h-3 w-3" />
              Phone Number
            </Label>
            <Input
              id="phone"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              disabled={!isEditing}
              className="bg-background"
            />
          </div>
        </div>

        {isEditing && (
          <Button
            onClick={handleSave}
            className="w-full bg-primary hover:bg-primary/90"
          >
            Save Changes
          </Button>
        )}
      </div>

      {/* Shopping Preferences Link */}
      <div
        onClick={() => navigate("/shopping-preferences")}
        className="bg-card rounded-xl shadow-sm border border-border p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors mb-6"
      >
        <div>
          <h3 className="font-medium text-foreground">Shopping Preferences</h3>
          <p className="text-sm text-muted-foreground">Manage your preferences</p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>

      {/* Logout Button */}
      <Button
        variant="outline"
        className="w-full border-destructive text-destructive hover:bg-destructive/10"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </div>
  );
};

export default ProfileView;
