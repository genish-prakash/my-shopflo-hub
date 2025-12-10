import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import wanderLogo from "@/assets/wander-logo.png";
import { ArrowLeft, ArrowRight, ShoppingBag, Sparkles, Shirt, Wine, Heart, Watch, Headphones, Dumbbell, Gift, Percent, Star, Package } from "lucide-react";

const ROTATING_TEXTS = [
  "Stay updated on your online orders at every step.",
  "Discover your next favourite Indian brand.",
  "Discover which brands are currently running a sale.",
  "Follow all your favourite brands at one place.",
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
  const [isLoading, setIsLoading] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isTextVisible, setIsTextVisible] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Rotate text every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTextVisible(false);
      setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % ROTATING_TEXTS.length);
        setIsTextVisible(true);
      }, 400);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSendOtp = () => {
    if (phoneNumber.length !== 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setShowOtpInput(true);
      setIsLoading(false);
      toast({
        title: "OTP Sent",
        description: "Check your phone for the verification code",
      });
    }, 1000);
  };

  const handleVerifyOtp = () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem("isAuthenticated", "true");
      navigate("/home");
    }, 1000);
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
                    left: '-80px',
                    animationDelay: `${product.delay}s`,
                    animationDuration: '16s',
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
          <h1 className="text-2xl font-bold text-foreground mb-8 z-10">Wander</h1>

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

          {/* Privacy Policy - Fixed to bottom */}
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
                </div>
              </div>
              
              <h1 className="text-xl font-bold text-foreground mb-1">
                {showOtpInput ? "Verify your number" : "Welcome to Wander"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {showOtpInput 
                  ? `Enter the code sent to +91 ${phoneNumber}` 
                  : "Enter your phone number to continue"
                }
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
                      setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
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
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
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
                    <p className="text-sm font-medium text-foreground">Track all orders</p>
                    <p className="text-xs text-muted-foreground">Real-time updates from all brands</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-2xl p-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Percent className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Exclusive offers</p>
                    <p className="text-xs text-muted-foreground">Get deals from your favorite brands</p>
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
                disabled={isLoading || otp.length !== 6}
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