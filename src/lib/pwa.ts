/**
 * PWA Detection and Platform Utilities
 */

/**
 * Check if app is running as installed PWA
 */
export const isPWA = (): boolean => {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes("android-app://")
  );
};

/**
 * Check if device is iOS
 */
export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

/**
 * Check if device is Android
 */
export const isAndroid = (): boolean => {
  return /Android/.test(navigator.userAgent);
};

/**
 * Get iOS version
 */
export const getIOSVersion = (): number | null => {
  if (!isIOS()) return null;

  const match = navigator.userAgent.match(/OS (\d+)_/);
  return match ? parseInt(match[1]) : null;
};

/**
 * Check if app can be installed
 */
export const canInstall = (): boolean => {
  return !isPWA();
};

/**
 * Check if device is mobile
 */
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Get platform name
 */
export const getPlatform = (): "ios" | "android" | "desktop" => {
  if (isIOS()) return "ios";
  if (isAndroid()) return "android";
  return "desktop";
};

/**
 * Check if running in Safari browser
 */
export const isSafari = (): boolean => {
  return (
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
    /iPad|iPhone|iPod/.test(navigator.userAgent)
  );
};

/**
 * Get browser name
 */
export const getBrowserName = (): string => {
  const ua = navigator.userAgent;

  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Chrome") && !ua.includes("Edg")) return "Chrome";
  if (isSafari()) return "Safari";
  if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";

  return "Unknown";
};

/**
 * Check if push notifications are supported
 */
export interface PushSupportResult {
  supported: boolean;
  reason?: string;
  needsInstall?: boolean;
}

export const checkPushSupport = (): PushSupportResult => {
  // Check if notifications API exists
  if (!("Notification" in window)) {
    return {
      supported: false,
      reason: "Notifications API not available in this browser",
    };
  }

  // Check if service workers are supported
  if (!("serviceWorker" in navigator)) {
    return {
      supported: false,
      reason: "Service Workers are not supported in this browser",
    };
  }

  // Check if PushManager is available
  if (!("PushManager" in window)) {
    return {
      supported: false,
      reason: "Push API is not supported in this browser",
    };
  }

  // iOS-specific checks
  if (isIOS()) {
    const version = getIOSVersion();

    if (version === null || version < 16) {
      return {
        supported: false,
        reason: "iOS 16.4 or later required for push notifications",
      };
    }

    // Check if running as standalone (required for iOS)
    const isStandalone = isPWA();

    if (!isStandalone) {
      return {
        supported: false,
        reason: "Install the app to your home screen to enable notifications",
        needsInstall: true,
      };
    }

    // Check if using Safari
    if (!isSafari()) {
      return {
        supported: false,
        reason: "Push notifications on iOS require Safari browser",
      };
    }
  }

  return { supported: true };
};

/**
 * Get install instructions for current platform
 */
export const getInstallInstructions = (): string[] => {
  const platform = getPlatform();

  if (platform === "ios") {
    return [
      "Open this site in Safari browser",
      "Tap the Share button (square with arrow)",
      "Scroll down and tap 'Add to Home Screen'",
      "Tap 'Add' to install the app",
      "Open the app from your home screen",
    ];
  }

  if (platform === "android") {
    return [
      "Tap the menu button (⋮) in Chrome",
      "Select 'Add to Home screen' or 'Install app'",
      "Tap 'Install' to confirm",
      "Open the installed app from your home screen",
    ];
  }

  return [
    "Click the install icon in your browser's address bar",
    "Or go to browser menu and select 'Install app'",
    "The app will be installed to your system",
  ];
};

/**
 * Display platform-friendly name
 */
export const getPlatformDisplayName = (): string => {
  const platform = getPlatform();
  const browser = getBrowserName();

  if (platform === "ios") return `iOS (${browser})`;
  if (platform === "android") return `Android (${browser})`;
  return `${browser} Browser`;
};
