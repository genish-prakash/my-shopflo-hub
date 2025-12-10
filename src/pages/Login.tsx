import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import wanderLogo from "@/assets/wander-logo.png";
import {
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Shirt,
  Wine,
  Heart,
  Watch,
  Headphones,
  Dumbbell,
  Gift,
  Percent,
  Star,
  Package,
} from "lucide-react";
import Cookies from "js-cookie"; // Added import for js-cookie
import { sendOtp, verifyOtp } from "@/lib/api";

const ROTATING_TEXTS = [
  "Shop your favorite brands",
  "Track all your orders",
  "Get exclusive rewards",
  "Seamless checkout experience",
];

const PRODUCT_IMAGES = [
  // Fashion & Accessories
  {
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop",
    color: "#FF6B6B",
  },
  {
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop",
    color: "#FFD93D",
  },
  {
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&h=200&fit=crop",
    color: "#FF69B4",
  },
  {
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop",
    color: "#000000",
  },
  {
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop",
    color: "#95A5A6",
  }, // Shoes
  {
    image:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200&h=200&fit=crop",
    color: "#3498DB",
  }, // Sneakers
  {
    image:
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=200&h=200&fit=crop",
    color: "#E74C3C",
  }, // Puma Shoe
  {
    image:
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=200&h=200&fit=crop",
    color: "#9B59B6",
  }, // Heels

  // Tech & Gadgets
  {
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
    color: "#4ECDC4",
  },
  {
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200&h=200&fit=crop",
    color: "#2ECC71",
  }, // Smart Watch
  {
    image:
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200&h=200&fit=crop",
    color: "#F1C40F",
  }, // Laptop
  {
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop",
    color: "#34495E",
  }, // Mouse
  {
    image:
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=200&h=200&fit=crop",
    color: "#1ABC9C",
  }, // Keyboard

  // Beauty & Personal Care
  {
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop",
    color: "#96CEB4",
  },
  {
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&h=200&fit=crop",
    color: "#45B7D1",
  },
  {
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=200&h=200&fit=crop",
    color: "#E67E22",
  }, // Lipstick
  {
    image:
      "https://images.unsplash.com/photo-1571781926291-280553fe18d4?w=200&h=200&fit=crop",
    color: "#D35400",
  }, // Makeup Brushes
  {
    image:
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=200&h=200&fit=crop",
    color: "#C0392B",
  }, // Cream

  // Home & Lifestyle
  {
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=200&h=200&fit=crop",
    color: "#16A34A",
  },
  {
    image:
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=200&h=200&fit=crop",
    color: "#7F8C8D",
  }, // Lamp
  {
    image:
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=200&h=200&fit=crop",
    color: "#F39C12",
  }, // Decor
  {
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop",
    color: "#27AE60",
  }, // Chair

  // Food & Drink
  {
    image:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=200&h=200&fit=crop",
    color: "#D35400",
  }, // Ice Cream
  {
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop",
    color: "#8E44AD",
  }, // Cake
  {
    image:
      "https://images.unsplash.com/photo-1621939514649-28b12e8167c7?w=200&h=200&fit=crop",
    color: "#2980B9",
  }, // Burger

  // Sports & Fitness
  {
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop",
    color: "#2C3E50",
  }, // Dumbbell
  {
    image:
      "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=200&h=200&fit=crop",
    color: "#16A085",
  }, // Gym Bag
  {
    image:
      "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=200&h=200&fit=crop",
    color: "#F39C12",
  }, // Yoga Mat
  {
    image:
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=200&h=200&fit=crop",
    color: "#C0392B",
  }, // Boxing Gloves
];

const FLOATING_PRODUCTS = [
  { icon: ShoppingBag, color: "#FF6B6B", delay: 0, top: 8 },
  { icon: Sparkles, color: "#4ECDC4", delay: 3, top: 25 },
  { icon: Shirt, color: "#45B7D1", delay: 6, top: 45 },
  { icon: Wine, color: "#96CEB4", delay: 9, top: 65 },
  { icon: Heart, color: "#FF69B4", delay: 1.5, top: 15 },
  { icon: Watch, color: "#FFD93D", delay: 4.5, top: 35 },
  { icon: Headphones, color: "#6C5CE7", delay: 7.5, top: 55 },
  { icon: Dumbbell, color: "#A8E6CF", delay: 10.5, top: 75 },
  { icon: Gift, color: "#FF8A5B", delay: 2, top: 85 },
  { icon: Percent, color: "#5B8DEE", delay: 5, top: 12 },
  { icon: Star, color: "#FFB800", delay: 8, top: 40 },
  { icon: Package, color: "#B794F4", delay: 11, top: 70 },
];

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"welcome" | "phone">("welcome");
  const [showOtpInput, setShowOtpInput] = useState(false);

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isTextVisible, setIsTextVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [contextId, setContextId] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = Cookies.get("shopper_flo_auth_token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTextVisible(false);
      setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % ROTATING_TEXTS.length);
        setIsTextVisible(true);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSendOtp = async () => {
    if (phoneNumber.length !== 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await sendOtp(phoneNumber);
      setContextId(response.data.context_id);
      setShowOtpInput(true);
      toast({
        title: "OTP Sent",
        description: "Check your phone for the verification code",
      });
    } catch (error) {
      toast({
        title: "Error sending OTP",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 4) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 4-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await verifyOtp(contextId, otp);

      // Store tokens in cookies
      Cookies.set("shopper_flo_auth_token", response.access_token, {
        expires: new Date(response.access_token_expires_at),
        secure: true,
        sameSite: "strict",
      });
      Cookies.set("shopper_flo_refresh_token", response.refresh_token, {
        expires: new Date(response.refresh_token_expires_at),
        secure: true,
        sameSite: "strict",
      });

      localStorage.setItem("isAuthenticated", "true");
      navigate("/home");
    } catch (error) {
      toast({
        title: "Invalid OTP",
        description: "Please check the code and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (showOtpInput) {
      setShowOtpInput(false);
      setOtp("");
    } else if (step === "phone") {
      setStep("welcome");
      setPhoneNumber("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-background to-purple-50 flex flex-col relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-purple-200/40 to-pink-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/30 to-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-gradient-to-r from-pink-200/20 to-yellow-200/20 rounded-full blur-2xl" />
      </div>

      {/* Header with back button */}
      {step !== "welcome" && (
        <div className="absolute top-0 left-0 right-0 p-4 z-10 animate-fade-in">
          <button
            onClick={handleBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
        </div>
      )}

      {/* Welcome Screen */}
      {step === "welcome" && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 animate-fade-in relative">
          {/* Floating Product Bubbles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {FLOATING_PRODUCTS.map((product, index) => {
              const IconComponent = product.icon;
              return (
                <div
                  key={index}
                  className="absolute animate-float-bubble"
                  style={{
                    top: `${product.top}%`,
                    left: "-80px",
                    animationDelay: `${product.delay}s`,
                    animationDuration: "16s",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg animate-bounce-gentle backdrop-blur-sm"
                    style={{
                      backgroundColor: `${product.color}25`,
                      border: `1.5px solid ${product.color}50`,
                    }}
                  >
                    <IconComponent
                      className="w-5 h-5"
                      style={{ color: product.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Logo */}
          <div className="mb-6 z-10">
            <img
              src={wanderLogo}
              alt="Wander"
              className="h-14 w-14 object-contain rounded-2xl shadow-lg"
            />
          </div>

          {/* App Name */}
          <h1 className="text-2xl font-bold text-foreground mb-1 z-10">
            Wander
          </h1>
          <p className="text-sm text-muted-foreground mb-8 z-10">by Shopflo</p>

          {/* Rotating Text with Shimmer */}
          <div className="h-24 flex items-center justify-center text-center px-4 mb-10 z-10">
            <p
              className={`text-xl font-semibold max-w-sm leading-relaxed transition-all duration-400 text-foreground ${
                isTextVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2"
              }`}
            >
              {ROTATING_TEXTS[currentTextIndex]}
            </p>
          </div>

          {/* Text indicators */}
          <div className="flex gap-2 mb-12 z-10">
            {ROTATING_TEXTS.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentTextIndex
                    ? "bg-primary w-6"
                    : "bg-muted-foreground/20 w-2"
                }`}
              />
            ))}
          </div>

          {/* Get Started Button */}
          <Button
            onClick={() => setStep("phone")}
            className="w-full max-w-sm h-14 text-base font-semibold bg-foreground text-background hover:bg-foreground/90 rounded-full z-10 shadow-lg"
          >
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          {/* Privacy Policy */}
          <p className="absolute bottom-6 left-0 right-0 text-xs text-center text-muted-foreground px-4 z-10">
            By continuing, you agree to Wander's Terms of Service and Privacy
            Policy
          </p>
        </div>
      )}

      {/* Phone Number & OTP Screen */}
      {step === "phone" && (
        <div className="flex-1 flex flex-col px-6 pt-20 animate-fade-in relative z-10">
          <div className="flex-1 flex flex-col">
            {/* Header Content */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 mb-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={wanderLogo}
                  alt="Wander"
                  className="h-10 w-10 object-contain rounded-xl"
                />
                <div>
                  <h2 className="font-semibold text-foreground">Wander</h2>
                  <p className="text-xs text-muted-foreground">by Shopflo</p>
                </div>
              </div>

              <h1 className="text-xl font-bold text-foreground mb-1">
                {showOtpInput ? "Verify your number" : "Welcome to Wander"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {showOtpInput
                  ? `Enter the code sent to +91 ${phoneNumber}`
                  : "Enter your phone number to continue"}
              </p>
            </div>

            {/* Input Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 shadow-sm space-y-4">
              {/* Phone Input */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Phone Number
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center h-12 px-3 bg-muted/50 rounded-xl text-foreground font-medium text-sm gap-1.5">
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <Input
                    type="tel"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(e) =>
                      setPhoneNumber(
                        e.target.value.replace(/\D/g, "").slice(0, 10)
                      )
                    }
                    className="flex-1 h-12 bg-muted/50 border-0 rounded-xl text-base placeholder:text-muted-foreground/60"
                    autoFocus
                    disabled={showOtpInput}
                  />
                </div>
              </div>

              {/* OTP Input - Shows after phone is submitted */}
              {showOtpInput && (
                <div className="animate-fade-in pt-2">
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">
                    Verification Code
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter 4-digit OTP"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    className="h-12 bg-muted/50 border-0 rounded-xl text-xl text-center tracking-[0.3em] placeholder:text-muted-foreground/60 placeholder:tracking-normal placeholder:text-sm"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setShowOtpInput(false);
                      setTimeout(() => {
                        setShowOtpInput(true);
                        toast({
                          title: "OTP Resent",
                          description: "A new code has been sent to your phone",
                        });
                      }, 500);
                    }}
                    className="text-xs text-primary hover:underline mt-3 block"
                  >
                    Didn't receive code? Resend
                  </button>
                </div>
              )}
            </div>

            {/* Shopping Benefits */}
            {!showOtpInput && (
              <div className="mt-6 space-y-3 animate-fade-in">
                <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-2xl p-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <Package className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Track all orders
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Real-time updates from all brands
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-2xl p-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Percent className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Exclusive offers
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Get deals from your favorite brands
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pb-8 pt-4">
            {!showOtpInput ? (
              <Button
                onClick={handleSendOtp}
                disabled={isLoading || phoneNumber.length !== 10}
                className="w-full h-14 text-base font-semibold bg-foreground text-background hover:bg-foreground/90 rounded-full disabled:opacity-40 shadow-lg"
              >
                {isLoading ? "Sending OTP..." : "Continue"}
              </Button>
            ) : (
              <Button
                onClick={handleVerifyOtp}
                disabled={isLoading || otp.length !== 4}
                className="w-full h-14 text-base font-semibold bg-foreground text-background hover:bg-foreground/90 rounded-full disabled:opacity-40 shadow-lg"
              >
                {isLoading ? "Verifying..." : "Verify & Continue"}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
