import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration provided by the user
export const firebaseConfig = {
  apiKey: "AIzaSyDAl0AE1OvHgDOqinr4_VVW8UOMOxFF_HQ",
  authDomain: "classic-fashion-pos.firebaseapp.com",
  projectId: "classic-fashion-pos",
  storageBucket: "classic-fashion-pos.firebasestorage.app",
  messagingSenderId: "172454758518",
  appId: "1:172454758518:web:4f282633f01e5751a37757",
  measurementId: "G-SY5FXJ55CK"
};

// Initialize Firebase app singleton
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);

// Safe Analytics initialization for browser environments
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // Analytics may not be supported in all environments (e.g., privacy extensions or non-supported browsers)
    });
}
