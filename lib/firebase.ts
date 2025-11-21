import { initializeApp } from "firebase/app";
import { getMessaging, getToken, Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const app = initializeApp(firebaseConfig);

let messaging: Messaging | null = null;

if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  messaging = getMessaging(app);
}

/**
 * Get FCM Token
 */
export const getFcmToken = async (): Promise<string | null> => {
  if (!messaging) return null;

  // Ask permission
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.warn("Notification permission not granted");
    return null;
  }

  try {
    const swReg = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
      serviceWorkerRegistration: swReg,
    });

    return token;
  } catch (error) {
    console.error("Error fetching FCM Token:", error);
    return null;
  }
};

