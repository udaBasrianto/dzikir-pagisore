import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously, GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAdvhIbabO4xrLpjHOhy0wiVCtCE_VnyKQ",
  authDomain: "lovable-dzikr.firebaseapp.com",
  projectId: "lovable-dzikr",
  storageBucket: "lovable-dzikr.firebasestorage.app",
  messagingSenderId: "336024950491",
  appId: "1:336024950491:web:666a52251792d6267ddefe",
  measurementId: "G-QH5HZJ435S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

// Sign in anonymously
export const signInAnonymousUser = async () => {
  try {
    await signInAnonymously(auth);
    return true;
  } catch (error) {
    console.error('Error signing in anonymously:', error);
    return false;
  }
};

// Google Sign In
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Note: Admin check is now handled by adminService via Supabase database
// This function is kept for backward compatibility but should use checkAdminStatus from adminService
export const isSuperAdmin = (user: User | null) => {
  // This is now a placeholder - actual check happens in AuthContext using adminService
  return false;
};

export default app;