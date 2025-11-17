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

export const parseProduct = (productString?: string | null) => {
  if (!productString || typeof productString !== "string") return {};

  try {
    const out: any = {};

    // Extract ObjectId
    const idMatch = /_id:\s*new ObjectId\('([^']+)'\)/.exec(productString);
    if (idMatch) out._id = idMatch[1];

    // Extract simple fields like skuId: 'SKU-e'
    const simpleFieldRegex =
      /(skuId|title|summary|mrp|currency)\s*:\s*'([^']+)'/g;

    let match;
    while ((match = simpleFieldRegex.exec(productString)) !== null) {
      out[match[1]] = match[2];
    }

    return out;
  } catch (err) {
    console.error("parseProduct failed:", err);
    return {};
  }
};

export function getSerialRange(prefix: string, start: string, count: number) {
  if (!start || !count) return { start, end: start };

  // Extract numeric part
  const match = start.match(/(\d+)$/);
  if (!match) return { start, end: start };

  const numStr = match[1]; // "000001"
  const num = parseInt(numStr, 10); // 1
  const endNum = num + count - 1; // e.g. 200

  const paddedEnd = endNum.toString().padStart(numStr.length, "0");

  // Replace only last numeric block
  const endSerial = start.replace(/\d+$/, paddedEnd);

  return {
    start,
    end: endSerial,
  };
}
