import { ArrowLeft, LogOut, Phone, Mail, Edit2, Check, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { getUserDisplayName } from "@/lib/userUtils";
import { shopfloAuthApi } from "@/services/authApi";
import UserAvatar from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, refreshUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const hasNames = user?.first_name || user?.last_name;

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
    toast({
      title: "Logged out successfully",
      description: "See you again soon!",
    });
  };

  const handleEdit = () => {
    setFirstName(user?.first_name || "");
    setLastName(user?.last_name || "");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFirstName("");
    setLastName("");
  };

  const handleSave = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User ID not found",
        variant: "destructive"
      });
      return;
    }

    if (!firstName.trim()) {
      toast({
        title: "Error",
        description: "First name is required",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await shopfloAuthApi.updateProfile(user.id, {
        first_name: firstName.trim(),
        last_name: lastName.trim() || undefined,
      });

      await refreshUser();
      setIsEditing(false);

      toast({
        title: "Success",
        description: "Profile updated successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
          <UserAvatar size="xl" className="mb-4" />

          {!hasNames || isEditing ? (
            <div className="w-full max-w-sm space-y-3">
              <Input
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isLoading}
              />
              <Input
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isLoading}
              />
              <div className="flex gap-2 justify-center">
                <Button onClick={handleSave} disabled={isLoading}>
                  <Check className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : "Save"}
                </Button>
                {hasNames && (
                  <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground mb-1">
                {getUserDisplayName(user)}
              </h1>
              <Button size="icon" variant="ghost" onClick={handleEdit}>
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Contact Details */}
      <div className="bg-card mx-4 mt-4 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Contact Details</p>
        </div>
        
        <div className="divide-y divide-border">
          {user?.email && (
            <div className="flex items-center gap-4 px-4 py-4">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                <Mail className="h-5 w-5 text-neutral-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                <p className="text-sm font-medium text-foreground">{user.email}</p>
              </div>
            </div>
          )}

          {user?.phone_number && (
            <div className="flex items-center gap-4 px-4 py-4">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                <Phone className="h-5 w-5 text-neutral-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-0.5">Phone</p>
                <p className="text-sm font-medium text-foreground">{user.phone_number}</p>
              </div>
            </div>
          )}
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
