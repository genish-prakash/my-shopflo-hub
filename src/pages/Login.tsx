import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import shopPassLogo from "@/assets/shop-pass-logo.svg";
import loginBackground from "@/assets/login-background.jpg";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
    // Simulate OTP sending
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
    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem("isAuthenticated", "true");
      navigate("/home");
    }, 1000);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url(${loginBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl shadow-card-hover p-8 space-y-6 border border-white/10">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-6">
              <img src={shopPassLogo} alt="Shop Pass" className="h-10" />
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-white/80">
              Your passport to shopping at your favorite brands
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-white">
                Phone Number
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter 10-digit number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                disabled={showOtpInput}
                className="h-12 bg-white/95 text-foreground border-white/30"
              />
            </div>

            {showOtpInput && (
              <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <label htmlFor="otp" className="text-sm font-medium text-white">
                  Enter OTP
                </label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="h-12 text-center text-2xl tracking-widest bg-white/95 text-foreground border-white/30"
                />
              </div>
            )}

            {!showOtpInput ? (
              <Button
                onClick={handleSendOtp}
                disabled={isLoading || phoneNumber.length !== 10}
                className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-smooth"
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </Button>
            ) : (
              <div className="space-y-3">
                <Button
                  onClick={handleVerifyOtp}
                  disabled={isLoading || otp.length !== 6}
                  className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-smooth"
                >
                  {isLoading ? "Verifying..." : "Verify & Continue"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowOtpInput(false);
                    setOtp("");
                  }}
                  className="w-full"
                >
                  Change Number
                </Button>
              </div>
            )}
          </div>

          <p className="text-xs text-center text-white/80">
            By continuing, you agree to Shop Pass's Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
