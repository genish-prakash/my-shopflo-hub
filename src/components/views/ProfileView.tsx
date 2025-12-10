import { useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, Award, Edit2, LogOut } from "lucide-react";
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
    gender: "",
    dateOfBirth: "",
    city: "",
    placeOfBirth: "",
  });

  const profileCompletion = () => {
    const fields = Object.values(profile).filter((val) => val !== "");
    return Math.round((fields.length / Object.keys(profile).length) * 100);
  };

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

  const completion = profileCompletion();

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Profile Completion Card */}
      <div className="bg-gradient-primary rounded-xl p-6 mb-6 shadow-card text-primary-foreground">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Profile Completion</h3>
            <p className="text-sm opacity-90">Earn 500 points by completing</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>{completion}% Complete</span>
            <span className="font-bold">{completion === 100 ? "🎉 Done!" : "Keep going!"}</span>
          </div>
          <div className="h-3 bg-primary-foreground/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-foreground transition-smooth"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-card rounded-xl shadow-card p-6 space-y-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Personal Information
        </h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Full Name
            </Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Phone Number
            </Label>
            <Input
              id="phone"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Input
                id="gender"
                placeholder="Enter gender"
                value={profile.gender}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob" className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Date of Birth
              </Label>
              <Input
                id="dob"
                type="date"
                value={profile.dateOfBirth}
                onChange={(e) =>
                  setProfile({ ...profile, dateOfBirth: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                City
              </Label>
              <Input
                id="city"
                placeholder="Current city"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthPlace">Place of Birth</Label>
              <Input
                id="birthPlace"
                placeholder="Birth place"
                value={profile.placeOfBirth}
                onChange={(e) =>
                  setProfile({ ...profile, placeOfBirth: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <Button
            onClick={handleSave}
            className="w-full bg-gradient-primary hover:opacity-90"
          >
            Save Changes
          </Button>
        )}
      </div>

      {/* Logout Button */}
      <Button
        variant="outline"
        className="w-full mt-6"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </div>
  );
};

export default ProfileView;
