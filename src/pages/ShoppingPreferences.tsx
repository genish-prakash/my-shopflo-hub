import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ChevronRight,
  User,
  Cake,
  Ruler,
  Sparkles,
  Scissors,
  MessageSquare,
  Truck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { profileApi } from "@/services/mystique/profileApi";
import type { UpdateProfileRequest } from "@/services/mystique/types";

type PreferenceSection = {
  id: string;
  label: string;
  icon: React.ElementType;
  value?: string;
  hasSubItems?: boolean;
};

const ShoppingPreferences = () => {
  const navigate = useNavigate();
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // State for all preferences
  const [preferences, setPreferences] = useState({
    gender: "",
    birthday: "",
    sizing: {
      shoeSize: "",
      shirtSize: "",
      pantsSize: "",
    },
    skinCare: {
      skinType: "",
      skinUndertone: "",
      skinTone: "",
    },
    hairCare: {
      hairType: "",
      hairColour: "",
    },
    marketing: {
      whatsapp: false,
      email: false,
      pushNotification: false,
    },
    shipping: {
      deliveryTime: "",
      dayOfWeek: "",
    },
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const profile = await profileApi.getProfile();
      setPreferences({
        gender: profile.gender?.toLowerCase() || "",
        birthday: profile.birthday || "",
        sizing: {
          shoeSize: profile.sizing_preferences?.shoe_size || "",
          shirtSize: profile.sizing_preferences?.shirt_size || "",
          pantsSize: profile.sizing_preferences?.pants_size || "",
        },
        skinCare: {
          skinType:
            profile.skincare_preferences?.skin_type?.toLowerCase() || "",
          skinUndertone:
            profile.skincare_preferences?.skin_undertone?.toLowerCase() || "",
          skinTone:
            profile.skincare_preferences?.skin_tone?.toLowerCase() || "",
        },
        hairCare: {
          hairType: profile.hair_preferences?.hair_type?.toLowerCase() || "",
          hairColour: (profile.hair_preferences as any)?.hair_color || "",
        },
        marketing: {
          whatsapp: profile.marketing_preferences?.whatsapp_enabled || false,
          email: profile.marketing_preferences?.email_enabled || false,
          pushNotification:
            profile.marketing_preferences?.push_enabled || false,
        },
        shipping: {
          deliveryTime:
            profile.shipping_preferences?.preferred_delivery_time?.toLowerCase() ||
            "",
          dayOfWeek:
            (profile.shipping_preferences as any)?.preferred_day_of_week || "",
        },
      });
    } catch (error) {
      console.error("Failed to fetch profile", error);
      // Don't show error toast on 404 as it might be a new user
    } finally {
      setIsLoading(false);
    }
  };

  const sections: PreferenceSection[] = [
    { id: "gender", label: "Gender", icon: User, value: preferences.gender },
    {
      id: "birthday",
      label: "Birthday",
      icon: Cake,
      value: preferences.birthday,
    },
    {
      id: "sizing",
      label: "Sizing",
      icon: Ruler,
      hasSubItems: true,
      value: preferences.sizing.shoeSize ? "Set" : "",
    },
    {
      id: "skinCare",
      label: "Skin Care",
      icon: Sparkles,
      hasSubItems: true,
      value: preferences.skinCare.skinType ? "Set" : "",
    },
    {
      id: "hairCare",
      label: "Hair Care",
      icon: Scissors,
      hasSubItems: true,
      value: preferences.hairCare.hairType ? "Set" : "",
    },
    {
      id: "marketing",
      label: "Marketing Preferences",
      icon: MessageSquare,
      hasSubItems: true,
      value:
        preferences.marketing.whatsapp ||
        preferences.marketing.email ||
        preferences.marketing.pushNotification
          ? "Set"
          : "",
    },
    {
      id: "shipping",
      label: "Shipping Preferences",
      icon: Truck,
      hasSubItems: true,
      value: preferences.shipping.deliveryTime ? "Set" : "",
    },
  ];

  const handleSave = async (section: string) => {
    try {
      const payload: UpdateProfileRequest = {
        gender: preferences.gender.toUpperCase() as any,
        birthday: preferences.birthday,
        sizing_preferences: {
          shoe_size: preferences.sizing.shoeSize,
          shirt_size: preferences.sizing.shirtSize,
          pants_size: preferences.sizing.pantsSize,
        },
        skincare_preferences: {
          skin_type: preferences.skinCare.skinType.toUpperCase() as any,
          skin_undertone:
            preferences.skinCare.skinUndertone.toUpperCase() as any,
          skin_tone: preferences.skinCare.skinTone.toUpperCase() as any,
        },
        hair_preferences: {
          hair_type: preferences.hairCare.hairType.toUpperCase() as any,
          // hair_color: preferences.hairCare.hairColour, // Add to types if needed
        },
        marketing_preferences: {
          whatsapp_enabled: preferences.marketing.whatsapp,
          email_enabled: preferences.marketing.email,
          push_enabled: preferences.marketing.pushNotification,
          rcs_enabled: false,
        },
        shipping_preferences: {
          preferred_delivery_time:
            preferences.shipping.deliveryTime.toUpperCase() as any,
          // preferred_day_of_week: preferences.shipping.dayOfWeek, // Add to types if needed
        },
      };

      // Add custom fields that might not be in the strict type definition yet
      if (preferences.hairCare.hairColour) {
        if (!payload.hair_preferences) payload.hair_preferences = {};
        (payload.hair_preferences as any).hair_color =
          preferences.hairCare.hairColour;
      }
      if (preferences.shipping.dayOfWeek) {
        if (!payload.shipping_preferences) payload.shipping_preferences = {};
        (payload.shipping_preferences as any).preferred_day_of_week =
          preferences.shipping.dayOfWeek;
      }

      await profileApi.updateProfile(payload);
      toast.success(`${section} preferences saved`);
      setActiveDialog(null);
    } catch (error) {
      console.error("Failed to save preferences", error);
      toast.error("Failed to save preferences");
    }
  };

  const renderDialogContent = () => {
    switch (activeDialog) {
      case "gender":
        return (
          <div className="space-y-4">
            <Label>Select your gender</Label>
            <Select
              value={preferences.gender}
              onValueChange={(value) =>
                setPreferences({ ...preferences, gender: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="non-binary">Non-binary</SelectItem>
                <SelectItem value="prefer-not-to-say">
                  Prefer not to say
                </SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="w-full bg-foreground text-background hover:bg-foreground/90"
              onClick={() => handleSave("Gender")}
            >
              Save
            </Button>
          </div>
        );

      case "birthday":
        return (
          <div className="space-y-4">
            <Label>Enter your birthday</Label>
            <Input
              type="date"
              value={preferences.birthday}
              onChange={(e) =>
                setPreferences({ ...preferences, birthday: e.target.value })
              }
            />
            <Button
              className="w-full bg-foreground text-background hover:bg-foreground/90"
              onClick={() => handleSave("Birthday")}
            >
              Save
            </Button>
          </div>
        );

      case "sizing":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Shoe Size (UK)</Label>
              <Select
                value={preferences.sizing.shoeSize}
                onValueChange={(value) =>
                  setPreferences({
                    ...preferences,
                    sizing: { ...preferences.sizing, shoeSize: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shoe size" />
                </SelectTrigger>
                <SelectContent>
                  {[5, 6, 7, 8, 9, 10, 11, 12].map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      UK {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Shirt Size</Label>
              <Select
                value={preferences.sizing.shirtSize}
                onValueChange={(value) =>
                  setPreferences({
                    ...preferences,
                    sizing: { ...preferences.sizing, shirtSize: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shirt size" />
                </SelectTrigger>
                <SelectContent>
                  {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Pants Size</Label>
              <Select
                value={preferences.sizing.pantsSize}
                onValueChange={(value) =>
                  setPreferences({
                    ...preferences,
                    sizing: { ...preferences.sizing, pantsSize: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pants size" />
                </SelectTrigger>
                <SelectContent>
                  {[28, 30, 32, 34, 36, 38, 40].map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full bg-foreground text-background hover:bg-foreground/90"
              onClick={() => handleSave("Sizing")}
            >
              Save
            </Button>
          </div>
        );

      case "skinCare":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Skin Type</Label>
              <Select
                value={preferences.skinCare.skinType}
                onValueChange={(value) =>
                  setPreferences({
                    ...preferences,
                    skinCare: { ...preferences.skinCare, skinType: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select skin type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oily">Oily</SelectItem>
                  <SelectItem value="dry">Dry</SelectItem>
                  <SelectItem value="combination">Combination</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="sensitive">Sensitive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Skin Undertone</Label>
              <Select
                value={preferences.skinCare.skinUndertone}
                onValueChange={(value) =>
                  setPreferences({
                    ...preferences,
                    skinCare: { ...preferences.skinCare, skinUndertone: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select undertone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warm">Warm</SelectItem>
                  <SelectItem value="cool">Cool</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Skin Tone</Label>
              <Select
                value={preferences.skinCare.skinTone}
                onValueChange={(value) =>
                  setPreferences({
                    ...preferences,
                    skinCare: { ...preferences.skinCare, skinTone: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select skin tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="tan">Tan</SelectItem>
                  <SelectItem value="deep">Deep</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full bg-foreground text-background hover:bg-foreground/90"
              onClick={() => handleSave("Skin Care")}
            >
              Save
            </Button>
          </div>
        );

      case "hairCare":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Hair Type</Label>
              <Select
                value={preferences.hairCare.hairType}
                onValueChange={(value) =>
                  setPreferences({
                    ...preferences,
                    hairCare: { ...preferences.hairCare, hairType: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select hair type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="straight">Straight</SelectItem>
                  <SelectItem value="wavy">Wavy</SelectItem>
                  <SelectItem value="curly">Curly</SelectItem>
                  <SelectItem value="coily">Coily</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Hair Colour</Label>
              <Select
                value={preferences.hairCare.hairColour}
                onValueChange={(value) =>
                  setPreferences({
                    ...preferences,
                    hairCare: { ...preferences.hairCare, hairColour: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select hair colour" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="black">Black</SelectItem>
                  <SelectItem value="brown">Brown</SelectItem>
                  <SelectItem value="blonde">Blonde</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="grey">Grey</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full bg-foreground text-background hover:bg-foreground/90"
              onClick={() => handleSave("Hair Care")}
            >
              Save
            </Button>
          </div>
        );

      case "marketing":
        return (
          <div className="space-y-4">
            <Label>Select your preferred channels</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="whatsapp"
                  checked={preferences.marketing.whatsapp}
                  onCheckedChange={(checked) =>
                    setPreferences({
                      ...preferences,
                      marketing: {
                        ...preferences.marketing,
                        whatsapp: checked as boolean,
                      },
                    })
                  }
                />
                <Label htmlFor="whatsapp" className="font-normal">
                  WhatsApp
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="email"
                  checked={preferences.marketing.email}
                  onCheckedChange={(checked) =>
                    setPreferences({
                      ...preferences,
                      marketing: {
                        ...preferences.marketing,
                        email: checked as boolean,
                      },
                    })
                  }
                />
                <Label htmlFor="email" className="font-normal">
                  Email
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="push"
                  checked={preferences.marketing.pushNotification}
                  onCheckedChange={(checked) =>
                    setPreferences({
                      ...preferences,
                      marketing: {
                        ...preferences.marketing,
                        pushNotification: checked as boolean,
                      },
                    })
                  }
                />
                <Label htmlFor="push" className="font-normal">
                  Push Notification
                </Label>
              </div>
            </div>
            <Button
              className="w-full bg-foreground text-background hover:bg-foreground/90"
              onClick={() => handleSave("Marketing")}
            >
              Save
            </Button>
          </div>
        );

      case "shipping":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Preferred Delivery Time</Label>
              <Select
                value={preferences.shipping.deliveryTime}
                onValueChange={(value) =>
                  setPreferences({
                    ...preferences,
                    shipping: { ...preferences.shipping, deliveryTime: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">
                    Morning (9 AM - 12 PM)
                  </SelectItem>
                  <SelectItem value="afternoon">
                    Afternoon (12 PM - 5 PM)
                  </SelectItem>
                  <SelectItem value="evening">Evening (5 PM - 9 PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Preferred Day of Week</Label>
              <Select
                value={preferences.shipping.dayOfWeek}
                onValueChange={(value) =>
                  setPreferences({
                    ...preferences,
                    shipping: { ...preferences.shipping, dayOfWeek: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekday">Weekdays</SelectItem>
                  <SelectItem value="weekend">Weekends</SelectItem>
                  <SelectItem value="any">Any day</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full bg-foreground text-background hover:bg-foreground/90"
              onClick={() => handleSave("Shipping")}
            >
              Save
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  const getDialogTitle = () => {
    const titles: Record<string, string> = {
      gender: "Gender",
      birthday: "Birthday",
      sizing: "Sizing Preferences",
      skinCare: "Skin Care",
      hairCare: "Hair Care",
      marketing: "Marketing Preferences",
      shipping: "Shipping Preferences",
    };
    return titles[activeDialog || ""] || "";
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center gap-3 px-4 h-14">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">
            Shopping Preferences
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-4 space-y-2 max-w-2xl mx-auto">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Card
              key={section.id}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setActiveDialog(section.id)}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-neutral-500" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">
                    {section.label}
                  </h4>
                  {section.value && (
                    <p className="text-sm text-muted-foreground">
                      {section.value}
                    </p>
                  )}
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Card>
          );
        })}
      </div>

      {/* Dialog for each preference */}
      <Dialog open={!!activeDialog} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
          </DialogHeader>
          {renderDialogContent()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShoppingPreferences;
