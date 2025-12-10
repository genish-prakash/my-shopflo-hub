import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import shopfloLogo from "@/assets/shopflo-logo.png";
import { ArrowLeft, ArrowRight, ShoppingBag, Sparkles, Shirt, Wine, Heart, Watch, Headphones, Dumbbell } from "lucide-react";

const ROTATING_TEXTS = [
  "Stay updated on your online orders at every step.",
  "Discover your next favourite Indian brand.",
  "Discover which brands are currently running a sale.",
  "Follow all your favourite brands at one place.",
];

const FLOATING_PRODUCTS = [
  { icon: ShoppingBag, color: "#FF6B6B", delay: 0, top: 10 },
  { icon: Sparkles, color: "#4ECDC4", delay: 3, top: 30 },
  { icon: Shirt, color: "#45B7D1", delay: 6, top: 55 },
  { icon: Wine, color: "#96CEB4", delay: 9, top: 75 },
  { icon: Heart, color: "#FF69B4", delay: 1.5, top: 20 },
  { icon: Watch, color: "#FFD93D", delay: 4.5, top: 45 },
  { icon: Headphones, color: "#6C5CE7", delay: 7.5, top: 65 },
  { icon: Dumbbell, color: "#A8E6CF", delay: 10.5, top: 85 },
];

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"welcome" | "phone" | "otp">("welcome");
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
      setStep("otp");
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
    if (step === "otp") {
      setStep("phone");
      setOtp("");
    } else if (step === "phone") {
      setStep("welcome");
      setPhoneNumber("");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with back button */}
      {step !== "welcome" && (
        <div className="absolute top-0 left-0 right-0 p-4 z-10 animate-fade-in">
          <button
            onClick={handleBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
        </div>
      )}

      {/* Welcome Screen */}
      {step === "welcome" && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 animate-fade-in relative overflow-hidden">
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
                    animationDuration: '14s',
                  }}
                >
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg animate-bounce-gentle"
                    style={{ 
                      backgroundColor: `${product.color}20`,
                      border: `2px solid ${product.color}40`,
                    }}
                  >
                    <IconComponent 
                      className="w-6 h-6 animate-pulse-slow" 
                      style={{ color: product.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Logo */}
          <div className="mb-8 z-10">
            <img
              src={shopfloLogo}
              alt="Shopflo"
              className="h-16 w-auto object-contain"
            />
          </div>

          {/* Rotating Text with Shimmer */}
          <div className="h-24 flex items-center justify-center text-center px-4 mb-12 z-10">
            <p
              className={`text-[22px] font-bold max-w-sm leading-relaxed transition-all duration-400 shimmer-text ${
                isTextVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2"
              }`}
            >
              {ROTATING_TEXTS[currentTextIndex]}
            </p>
          </div>

          {/* Text indicators */}
          <div className="flex gap-2 mb-16 z-10">
            {ROTATING_TEXTS.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentTextIndex
                    ? "bg-foreground w-6"
                    : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          {/* Get Started Button */}
          <Button
            onClick={() => setStep("phone")}
            className="w-full max-w-sm h-14 text-base font-semibold bg-foreground text-background hover:bg-foreground/90 rounded-full z-10"
          >
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          {/* Privacy Policy - Fixed to bottom */}
          <p className="absolute bottom-6 left-0 right-0 text-xs text-center text-muted-foreground px-4 z-10">
            By continuing, you agree to Shopflo's Terms of Service and Privacy
            Policy
          </p>
        </div>
      )}

      {/* Phone Number Screen */}
      {step === "phone" && (
        <div className="flex-1 flex flex-col px-6 pt-20 animate-fade-in">
          <div className="flex-1 flex flex-col">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Enter your phone number
            </h1>
            <p className="text-muted-foreground mb-8">
              We'll send you a verification code
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-14 px-4 bg-secondary rounded-xl text-foreground font-medium">
                  +91
                </div>
                <Input
                  type="tel"
                  placeholder="Phone number"
                  value={phoneNumber}
                  onChange={(e) =>
                    setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  className="flex-1 h-14 bg-secondary border-0 rounded-xl text-lg placeholder:text-muted-foreground"
                  autoFocus
                />
              </div>
            </div>
          </div>

          <div className="pb-8">
            <Button
              onClick={handleSendOtp}
              disabled={isLoading || phoneNumber.length !== 10}
              className="w-full h-14 text-base font-semibold bg-foreground text-background hover:bg-foreground/90 rounded-full disabled:opacity-40"
            >
              {isLoading ? "Sending..." : "Continue"}
            </Button>
          </div>
        </div>
      )}

      {/* OTP Verification Screen */}
      {step === "otp" && (
        <div className="flex-1 flex flex-col px-6 pt-20 animate-fade-in">
          <div className="flex-1 flex flex-col">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Enter verification code
            </h1>
            <p className="text-muted-foreground mb-8">
              Sent to +91 {phoneNumber}
            </p>

            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="h-14 bg-secondary border-0 rounded-xl text-2xl text-center tracking-[0.5em] placeholder:text-muted-foreground placeholder:tracking-normal placeholder:text-base"
                autoFocus
              />

              <button
                onClick={handleSendOtp}
                className="text-sm text-primary hover:underline"
              >
                Resend code
              </button>
            </div>
          </div>

          <div className="pb-8">
            <Button
              onClick={handleVerifyOtp}
              disabled={isLoading || otp.length !== 6}
              className="w-full h-14 text-base font-semibold bg-foreground text-background hover:bg-foreground/90 rounded-full disabled:opacity-40"
            >
              {isLoading ? "Verifying..." : "Verify & Continue"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
