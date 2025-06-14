import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDcoyYOlXb_I767CVOtwKzT9znyAUmHnms",
  authDomain: "pos-gemini.firebaseapp.com",
  projectId: "pos-gemini",
  storageBucket: "pos-gemini.firebasestorage.app",
  messagingSenderId: "602180862196",
  appId: "1:602180862196:web:4a3861127d2f0f93a8dea1",
  measurementId: "G-K9T4D8G8F7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

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

export default app;