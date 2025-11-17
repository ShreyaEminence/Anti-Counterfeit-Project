import Cookies from "js-cookie";
// import { messaging } from "@/firebase";
// import { getToken } from "firebase/messaging";

export const setCustomCookie = (
  key: string,
  value: string,
  options?: {
    expires?: number;
    path?: string;
    secure?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
  }
): void => {
  const defaultOptions = {
    expires: 1,
    path: "/",
    secure: true,
    sameSite: "Strict" as const,
  };

  const finalOptions = { ...defaultOptions, ...options };

  Cookies.set(key, value, {
    expires: finalOptions.expires,
    path: finalOptions.path,
    secure: finalOptions.secure,
    sameSite: finalOptions.sameSite,
  });
};

export const removeCustomCookie = (Key: string): void => {
  Cookies.remove(Key, {
    path: "/",
  });
};

// export const getFcmToken = async () => {
//   try {
//     const permission = await Notification.requestPermission();

//     if (permission !== "granted") {
//       console.log("Permission not granted");
//       return null;
//     }

//     const token = await getToken(messaging, {
//       vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
//     });

//     return token;
//   } catch (error) {
//     console.log("FCM Error:", error);
//     return null;
//   }
// };
