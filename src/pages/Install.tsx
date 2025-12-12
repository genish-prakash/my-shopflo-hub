import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Share, Plus, Check, Smartphone, Apple, Chrome } from "lucide-react";
import shopPassLogo from "@/assets/shop-pass-logo.svg";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);
    
    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);

    // Check if already installed (standalone mode)
    const standalone = window.matchMedia("(display-mode: standalone)").matches || 
                      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);
    setIsInstalled(standalone);

    // Listen for beforeinstallprompt event (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  if (isStandalone) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Already Installed!</h1>
        <p className="text-muted-foreground text-center">
          You're already using Shop Pass as an app.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <img 
          src={shopPassLogo} 
          alt="Shop Pass" 
          className="w-24 h-24 mb-6"
        />
        <h1 className="text-3xl font-bold text-foreground mb-2 text-center">
          Install Shop Pass
        </h1>
        <p className="text-muted-foreground text-center mb-8 max-w-sm">
          Get the full app experience with quick access from your home screen.
        </p>

        {/* Install Button for Android/Chrome */}
        {deferredPrompt && (
          <Button 
            onClick={handleInstallClick}
            size="lg"
            className="w-full max-w-sm gap-2 mb-4"
          >
            <Download className="w-5 h-5" />
            Install App
          </Button>
        )}

        {isInstalled && !isStandalone && (
          <div className="flex items-center gap-2 text-green-600 mb-4">
            <Check className="w-5 h-5" />
            <span className="font-medium">App installed successfully!</span>
          </div>
        )}

        {/* iOS Instructions */}
        {isIOS && !deferredPrompt && !isInstalled && (
          <div className="w-full max-w-sm bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                <Apple className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Install on iPhone/iPad</h3>
                <p className="text-sm text-muted-foreground">Follow these steps</p>
              </div>
            </div>
            
            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    Tap the <Share className="inline w-4 h-4 mx-1" /> Share button in Safari
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    Scroll down and tap <span className="font-medium">"Add to Home Screen"</span>
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    Tap <span className="font-medium">"Add"</span> to install
                  </p>
                </div>
              </li>
            </ol>
          </div>
        )}

        {/* Android Instructions (fallback if prompt not available) */}
        {isAndroid && !deferredPrompt && !isInstalled && (
          <div className="w-full max-w-sm bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Install on Android</h3>
                <p className="text-sm text-muted-foreground">Follow these steps</p>
              </div>
            </div>
            
            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    Tap the menu <span className="font-medium">⋮</span> in Chrome
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    Tap <span className="font-medium">"Install app"</span> or <span className="font-medium">"Add to Home screen"</span>
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    Confirm by tapping <span className="font-medium">"Install"</span>
                  </p>
                </div>
              </li>
            </ol>
          </div>
        )}

        {/* Desktop Instructions */}
        {!isIOS && !isAndroid && !deferredPrompt && !isInstalled && (
          <div className="w-full max-w-sm bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                <Chrome className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Install on Desktop</h3>
                <p className="text-sm text-muted-foreground">Using Chrome or Edge</p>
              </div>
            </div>
            
            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    Look for the <Plus className="inline w-4 h-4 mx-1" /> install icon in the address bar
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    Click <span className="font-medium">"Install"</span> to add the app
                  </p>
                </div>
              </li>
            </ol>
          </div>
        )}
      </div>

      {/* Benefits Section */}
      <div className="p-6 pb-12">
        <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center">Why install?</h3>
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Download className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Works offline</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Smartphone className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Quick access</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Check className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Full experience</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Install;
