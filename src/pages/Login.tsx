import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import wanderLogo from "@/assets/wander-logo.png";
import tshirtImg from "@/assets/tshirt_wander.png";
import shoesImg from "@/assets/shoes_wander.png";
import sareeImg from "@/assets/saree_wander.png";
import proteinImg from "@/assets/protein_wander.png";
import necklaceImg from "@/assets/necklace_wander.png";
import lipstickImg from "@/assets/lipstick_wander.png";
import joggerImg from "@/assets/jogger_wander.png";
import { ArrowLeft, ArrowRight, Package, Percent } from "lucide-react";

const ROTATING_TEXTS = [
  "Stay updated on your online orders at every step",
  "Discover your next favourite Indian brand",
  "Discover which brands are currently running a sale",
  "Follow all your favourite brands at one place",
];

const FLOATING_PRODUCTS = [
  { img: tshirtImg, top: 8, left: 5, delay: 0 },
  { img: shoesImg, top: 28, right: 8, delay: 0.5 },
  { img: sareeImg, top: 48, left: 3, delay: 1 },
  { img: proteinImg, top: 68, right: 5, delay: 1.5 },
  { img: necklaceImg, top: 15, right: 2, delay: 0.3 },
  { img: lipstickImg, top: 55, right: 10, delay: 0.8 },
  { img: joggerImg, top: 78, left: 8, delay: 1.2 },
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
      {/* Light Grid Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(270 50% 80% / 0.4) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(270 50% 80% / 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

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
          {/* Floating Product Images */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {FLOATING_PRODUCTS.map((product, index) => (
              <div
                key={index}
                className="absolute animate-float-vertical"
                style={{
                  top: `${product.top}%`,
                  ...(product.left !== undefined ? { left: `${product.left}%` } : {}),
                  ...(product.right !== undefined ? { right: `${product.right}%` } : {}),
                  animationDelay: `${product.delay}s`,
                }}
              >
                <img 
                  src={product.img} 
                  alt="" 
                  className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-lg"
                />
              </div>
            ))}
          </div>

          {/* Logo */}
          <div className="mb-4 z-10">
            <img
              src={wanderLogo}
              alt="Wander"
              className="h-14 w-14 object-contain rounded-2xl shadow-lg"
            />
          </div>

          {/* App Name with Shimmer */}
          <div className="text-center mb-8 z-10">
            <h1 className="text-3xl font-bold shimmer-text font-roboto mb-1">
              Wander
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              from Shopflo
            </p>
          </div>

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
                  <h2 className="font-semibold text-foreground font-roboto">Wander</h2>
                  <p className="text-xs text-muted-foreground">from Shopflo</p>
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
