import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "motion/react";
import shopfloLogo from "@/assets/shopflo-logo.png";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { sendOtp, verifyOtp } from "@/lib/api";
import Cookies from "js-cookie";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

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

const OrbitingIcon = ({
  image,
  color,
  delay,
  radius,
  duration,
}: {
  image: string;
  color: string;
  delay: number;
  radius: number;
  duration: number;
}) => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <motion.div
        className="flex items-center justify-center"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear",
          delay: -delay,
        }}
        style={{
          width: radius * 2,
          height: radius * 2,
        }}
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-lg border border-white/40 backdrop-blur-md bg-white/10 hover:scale-110 transition-transform duration-300"
          style={{
            boxShadow: `0 8px 32px 0 ${color}30`,
          }}
        >
          <motion.div
            animate={{ rotate: [0, -360] }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: "linear",
              delay: -delay,
            }}
            className="w-full h-full p-3"
          >
            <img
              src={image}
              alt="Brand"
              className="w-full h-full object-contain drop-shadow-sm"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/64x64?text=Brand";
              }}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"welcome" | "phone" | "otp">("welcome");
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
      setStep("otp");
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
        <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-background">
          {/* Background Marquee */}
          {/* Background Orbiting Icons */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
            {/* Inner Orbit - 6 items */}
            {PRODUCT_IMAGES.slice(0, 6).map((item, i) => (
              <OrbitingIcon
                key={`inner-${i}`}
                image={item.image}
                color={item.color}
                delay={i * (30 / 6)}
                radius={200}
                duration={30}
              />
            ))}

            {/* Middle Orbit - 10 items */}
            {PRODUCT_IMAGES.slice(6, 16).map((item, i) => (
              <OrbitingIcon
                key={`middle-${i}`}
                image={item.image}
                color={item.color}
                delay={i * (40 / 10)}
                radius={320}
                duration={40}
              />
            ))}

            {/* Outer Orbit - 14 items */}
            {PRODUCT_IMAGES.slice(16, 30).map((item, i) => (
              <OrbitingIcon
                key={`outer-${i}`}
                image={item.image}
                color={item.color}
                delay={i * (50 / 14)}
                radius={440}
                duration={50}
              />
            ))}

            {/* Decorative Circles */}
            <div className="absolute border border-dashed border-primary/10 rounded-full w-[400px] h-[400px]" />
            <div className="absolute border border-dashed border-primary/10 rounded-full w-[640px] h-[640px]" />
            <div className="absolute border border-dashed border-primary/10 rounded-full w-[880px] h-[880px]" />
          </div>

          {/* Foreground Content */}
          <div className="z-10 flex flex-col items-center gap-8 px-6 animate-fade-in">
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/20 blur-xl rounded-full" />
              <img
                src={shopfloLogo}
                alt="Shopflo"
                className="relative h-20 w-auto object-contain"
              />
            </div>

            <div className="text-center space-y-3 max-w-sm">
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                Shopflo
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The best way to shop your favorite brands
              </p>
            </div>

            <Button
              onClick={() => setStep("phone")}
              className="w-full max-w-xs h-14 text-base font-semibold bg-foreground text-background hover:bg-foreground/90 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Privacy Policy */}
          <p className="absolute bottom-6 left-0 right-0 text-xs text-center text-muted-foreground px-4 z-10">
            By continuing, you agree to Shopflo's Terms of Service and Privacy
            Policy
          </p>
        </div>
      )}

      {/* Phone Number Screen */}
      {step === "phone" && (
        <div className="flex-1 flex flex-col items-center justify-center px-4 animate-fade-in bg-background">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Welcome back
              </h1>
              <p className="text-muted-foreground">
                Enter your phone number to continue
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 p-1 bg-secondary/50 rounded-2xl border border-border/50 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-300">
                <div className="flex items-center justify-center h-12 px-4 bg-background rounded-xl text-foreground font-medium shadow-sm">
                  +91
                </div>
                <Input
                  type="tel"
                  placeholder="99999 99999"
                  value={phoneNumber}
                  onChange={(e) =>
                    setPhoneNumber(
                      e.target.value.replace(/\D/g, "").slice(0, 10)
                    )
                  }
                  className="flex-1 h-12 bg-transparent border-0 rounded-xl text-lg placeholder:text-muted-foreground/50 focus-visible:ring-0 px-2"
                  autoFocus
                />
              </div>

              <Button
                onClick={handleSendOtp}
                disabled={isLoading || phoneNumber.length !== 10}
                className="w-full h-12 text-base font-semibold bg-foreground text-background hover:bg-foreground/90 rounded-xl transition-all duration-300"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Verification Screen */}
      {step === "otp" && (
        <div className="flex-1 flex flex-col items-center justify-center px-4 animate-fade-in bg-background">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Verify OTP
              </h1>
              <p className="text-muted-foreground">Sent to +91 {phoneNumber}</p>
            </div>

            <div className="space-y-8 flex flex-col items-center">
              <InputOTP
                maxLength={4}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup className="gap-4">
                  <InputOTPSlot
                    index={0}
                    className="h-14 w-14 rounded-xl border-2 text-2xl"
                  />
                  <InputOTPSlot
                    index={1}
                    className="h-14 w-14 rounded-xl border-2 text-2xl"
                  />
                  <InputOTPSlot
                    index={2}
                    className="h-14 w-14 rounded-xl border-2 text-2xl"
                  />
                  <InputOTPSlot
                    index={3}
                    className="h-14 w-14 rounded-xl border-2 text-2xl"
                  />
                </InputOTPGroup>
              </InputOTP>

              <div className="w-full space-y-4">
                <Button
                  onClick={handleVerifyOtp}
                  disabled={isLoading || otp.length !== 4}
                  className="w-full h-12 text-base font-semibold bg-foreground text-background hover:bg-foreground/90 rounded-xl transition-all duration-300"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Verify & Continue"
                  )}
                </Button>

                <button
                  onClick={handleSendOtp}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Resend code
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
