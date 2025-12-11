import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { shopfloAuthApi } from "@/services/authApi";
import wanderLogo from "@/assets/wander-logo.png";
import tshirtImg from "@/assets/tshirt_wander.png";
import shoesImg from "@/assets/shoes_wander.png";
import sareeImg from "@/assets/saree_wander.png";
import proteinImg from "@/assets/protein_wander.png";
import necklaceImg from "@/assets/necklace_wander.png";
import lipstickImg from "@/assets/lipstick_wander.png";
import joggerImg from "@/assets/jogger_wander.png";
import cremeImg from "@/assets/creme_wander.png";
import boxImg from "@/assets/box_wander.png";
import dressImg from "@/assets/dress_wander.png";
import { ArrowLeft, ArrowRight, Package, Percent } from "lucide-react";

const ROTATING_TEXTS = [
  "Stay updated on your online orders at every step",
  "Discover your next favourite Indian brand",
  "Discover which brands are currently running a sale",
  "Follow all your favourite brands at one place",
];

// Mobile-optimized floating positions - spread along left and right edges only
const FLOATING_PRODUCTS = [
  // Left side - top to bottom
  { img: tshirtImg, top: 5, left: 2, delay: 0 },
  { img: sareeImg, top: 22, left: 4, delay: 0.8 },
  { img: necklaceImg, top: 40, left: 2, delay: 0.3 },
  { img: joggerImg, top: 58, left: 5, delay: 1.2 },
  { img: boxImg, top: 75, left: 3, delay: 1.6 },
  // Right side - top to bottom
  { img: shoesImg, top: 8, right: 2, delay: 0.5 },
  { img: proteinImg, top: 28, right: 4, delay: 1.0 },
  { img: lipstickImg, top: 48, right: 2, delay: 0.6 },
  { img: cremeImg, top: 65, right: 5, delay: 1.4 },
  { img: dressImg, top: 82, right: 3, delay: 0.9 },
];

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"welcome" | "phone" | "email">("welcome");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showEmailOtpInput, setShowEmailOtpInput] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isTextVisible, setIsTextVisible] = useState(true);
  const [contextId, setContextId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
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
      const response = await shopfloAuthApi.sendOtp(phoneNumber);

      if (response.success) {
        setContextId(response.data.context_id);
        setIsNewUser(response.data.is_new_customer);
        setShowOtpInput(true);

        toast({
          title: "OTP Sent",
          description: "Check your phone for the verification code",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send OTP. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    if (phoneOtp.length !== 4) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 4-digit OTP",
        variant: "destructive",
      });
      return;
    }

    if (!contextId) {
      toast({
        title: "Error",
        description: "Session expired. Please request a new OTP.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await shopfloAuthApi.verifyOtp(contextId, phoneOtp);

      if (response.success && response.data.otp_verified) {
        // Store auth tokens in cookies
        shopfloAuthApi.setAuthToken(response.data.access_token, response.data.refresh_token);

        setPhoneVerified(true);

        toast({
          title: "Success",
          description: "Phone verified successfully!",
        });

        // Fetch user data to check if email exists
        try {
          const userData = await shopfloAuthApi.getUserData(response.data.access_token);

          console.log('User data from /me API:', userData);

          // Store user ID for later use in email verification
          setUserId(userData.id);
          console.log('Stored userId:', userData.id);

          // Check if user has email using the external email key
          const hasEmail = userData.email && userData.email !== '' && userData.email !== null;

          if (!hasEmail) {
            // User doesn't have email, show email verification screen
            console.log('No email found, showing email verification screen');
            setStep("email");
          } else {
            // User has email, navigate to home
            console.log('Email found, navigating to home');
            navigate("/home");
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          // If fetching user data fails, still navigate to home
          navigate("/home");
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to verify OTP. Please try again.";
      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmailOtp = async () => {
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    if (!userId) {
      toast({
        title: "Error",
        description: "User ID not found. Please try logging in again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Send OTP with linked_user_id from /me API
      console.log('Sending email OTP with userId:', userId);
      const response = await shopfloAuthApi.sendOtp(email, userId);

      if (response.success) {
        setContextId(response.data.context_id);
        setShowEmailOtpInput(true);

        toast({
          title: "Code Sent",
          description: "Check your email for the verification code",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send verification code. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (emailOtp.length !== 4) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 4-digit OTP",
        variant: "destructive",
      });
      return;
    }

    if (!contextId) {
      toast({
        title: "Error",
        description: "Session expired. Please request a new code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await shopfloAuthApi.verifyOtp(contextId, emailOtp);

      if (response.success && response.data.otp_verified) {
        // Email verified successfully - tokens remain from phone verification
        toast({
          title: "Success",
          description: "Email verified successfully!",
        });

        // Navigate to home page
        navigate("/home");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to verify OTP. Please try again.";
      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === "phone" && showOtpInput) {
      setShowOtpInput(false);
      setPhoneOtp("");
    } else if (step === "email" && showEmailOtpInput) {
      setShowEmailOtpInput(false);
      setEmailOtp("");
    } else if (step === "email" && !showEmailOtpInput) {
      setStep("phone");
      setShowOtpInput(false);
      setPhoneOtp("");
      setEmail("");
      setPhoneVerified(false);
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
          {/* Floating Product Images - Spread across screen */}
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
                  className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-lg"
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
                    ? "bg-foreground w-6"
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
                    placeholder="Enter 4-digit OTP"
                    value={phoneOtp}
                    onChange={(e) =>
                      setPhoneOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    className="h-12 bg-muted/50 border-0 rounded-xl text-xl text-center tracking-[0.3em] placeholder:text-muted-foreground/60 placeholder:tracking-normal placeholder:text-sm"
                    autoFocus
                  />
                  <button
                    onClick={async () => {
                      setIsLoading(true);
                      try {
                        const response = await shopfloAuthApi.sendOtp(phoneNumber);
                        if (response.success) {
                          setContextId(response.data.context_id);
                          toast({
                            title: "OTP Resent",
                            description: "A new code has been sent to your phone",
                          });
                        }
                      } catch (error) {
                        toast({
                          title: "Error",
                          description: "Failed to resend OTP. Please try again.",
                          variant: "destructive",
                        });
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground hover:underline mt-3 block"
                    disabled={isLoading}
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
                {isLoading ? "Checking..." : "Continue"}
              </Button>
            ) : (
              <Button
                onClick={handleVerifyPhoneOtp}
                disabled={isLoading || phoneOtp.length !== 4}
                className="w-full h-14 text-base font-semibold bg-foreground text-background hover:bg-foreground/90 rounded-full disabled:opacity-40 shadow-lg"
              >
                {isLoading ? "Verifying..." : "Verify & Continue"}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Email Verification Screen (New Users) */}
      {step === "email" && (
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
                {showOtpInput ? "Verify your email" : "Welcome to Wander"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {showOtpInput 
                  ? `Enter the code sent to ${email}` 
                  : "You're new here! Please enter your email to continue"
                }
              </p>
            </div>

            {/* Input Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 shadow-sm space-y-4">
              {/* Email Input */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-muted/50 border-0 rounded-xl text-base placeholder:text-muted-foreground/60"
                  autoFocus
                  disabled={showEmailOtpInput}
                />
              </div>

              {/* OTP Input - Shows after email is submitted */}
              {showEmailOtpInput && (
                <div className="animate-fade-in pt-2">
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">
                    Verification Code
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter 4-digit OTP"
                    value={emailOtp}
                    onChange={(e) =>
                      setEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    className="h-12 bg-muted/50 border-0 rounded-xl text-xl text-center tracking-[0.3em] placeholder:text-muted-foreground/60 placeholder:tracking-normal placeholder:text-sm"
                    autoFocus
                  />
                  <button
                    onClick={async () => {
                      setIsLoading(true);
                      try {
                        const response = await shopfloAuthApi.sendOtp(email, userId);
                        if (response.success) {
                          setContextId(response.data.context_id);
                          toast({
                            title: "Code Resent",
                            description: "A new code has been sent to your email",
                          });
                        }
                      } catch (error) {
                        toast({
                          title: "Error",
                          description: "Failed to resend code. Please try again.",
                          variant: "destructive",
                        });
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground hover:underline mt-3 block"
                    disabled={isLoading}
                  >
                    Didn't receive code? Resend
                  </button>
                </div>
              )}
            </div>

            {/* Info for new users */}
            {!showEmailOtpInput && (
              <div className="mt-6 animate-fade-in">
                <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-2xl p-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center">
                    <Package className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">New to Wander?</p>
                    <p className="text-xs text-muted-foreground">We'll create your account with this email</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pb-8 pt-4">
            {!showEmailOtpInput ? (
              <Button
                onClick={handleSendEmailOtp}
                disabled={isLoading || !email || !email.includes("@")}
                className="w-full h-14 text-base font-semibold bg-foreground text-background hover:bg-foreground/90 rounded-full disabled:opacity-40 shadow-lg"
              >
                {isLoading ? "Sending code..." : "Continue"}
              </Button>
            ) : (
              <Button
                onClick={handleVerifyEmailOtp}
                disabled={isLoading || emailOtp.length !== 4}
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
