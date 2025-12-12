import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getMessaging,
  getToken,
  onMessage,
  type Messaging,
} from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6VALSjx63gFjSvVcz5PSGvoqnzmGwwnw",
  authDomain: "wander-e2541.firebaseapp.com",
  projectId: "wander-e2541",
  storageBucket: "wander-e2541.firebasestorage.app",
  messagingSenderId: "673687823780",
  appId: "1:673687823780:web:21e886c649af1a31500d31",
  measurementId: "G-0FHJSLE2FH",
};

// VAPID key for Web Push
export const VAPID_KEY =
  "BMVQnEpb_3nwWHoVMd1xT8IDrQRtFbU7Epa22jKHZMWo4-9-g83Xhsx-xtuFsXexwjzjcbVouCSN1RNLopo-PKw";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (optional, only in browser)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Initialize Messaging
let messaging: Messaging | null = null;
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  messaging = getMessaging(app);
}

export { app, analytics, messaging, getToken, onMessage };
