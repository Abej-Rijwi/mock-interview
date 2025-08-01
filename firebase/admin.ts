import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK
function initFirebaseAdmin() {
  const apps = getApps();

  if (!apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKeyRaw) {
      console.error("❌ Missing Firebase Admin environment variables.");
      throw new Error("Missing Firebase Admin credentials.");
    }

    let privateKey: string;
    try {
      privateKey = privateKeyRaw.replace(/\\n/g, "\n");
    } catch (e) {
      console.error("❌ Failed to parse Firebase private key");
      throw e;
    }

    try {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } catch (error) {
      console.error("❌ Firebase Admin initialization failed:", error);
      throw error;
    }
  }

  return {
    auth: getAuth(),
    db: getFirestore(),
  };
}

export const { auth, db } = initFirebaseAdmin();
