import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, signInWithGoogle, signInAnonymousUser, signOut } from '@/config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { 
  syncUserDataToFirebase, 
  loadUserDataFromFirebase, 
  applyUserDataToLocal, 
  setupAutoSync 
} from '@/services/userDataService';
import { checkAdminStatus, isAdminEmail } from '@/services/adminService';

export type UserRole = 'superadmin' | 'admin' | 'user' | 'anonymous';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  isAnonymous: boolean;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInGoogle: () => Promise<void>;
  signInAnonymous: () => Promise<void>;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isSuperAdminUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataSynced, setDataSynced] = useState(false);

  const getUserProfile = async (user: User): Promise<UserProfile> => {
    if (user.isAnonymous) {
      return {
        uid: user.uid,
        email: null,
        displayName: 'Anonymous User',
        role: 'anonymous',
        isAnonymous: true,
        createdAt: new Date()
      };
    }

    // Check admin status from Supabase database
    const { isAdmin, role: adminRole } = await checkAdminStatus(user.uid, user.email || '');
    
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    // Determine role: admin from Supabase takes priority
    const role: UserRole = isAdmin && adminRole ? adminRole : 'user';

    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role,
        isAnonymous: false,
        createdAt: data.createdAt?.toDate() || new Date()
      };
    } else {
      // Create new user profile in Firebase
      const newProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role,
        isAnonymous: false,
        createdAt: new Date()
      };

      await setDoc(userDocRef, {
        email: user.email,
        displayName: user.displayName,
        role,
        createdAt: new Date()
      });

      return newProfile;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const profile = await getUserProfile(user);
          setUserProfile(profile);
          
          // Sync user data with Firebase (only for non-anonymous users)
          if (!user.isAnonymous && !dataSynced) {
            try {
              // First try to load data from Firebase
              const firebaseData = await loadUserDataFromFirebase(user.uid);
              
              if (firebaseData) {
                // Apply Firebase data to local storage
                applyUserDataToLocal(firebaseData);
              } else {
                // Upload local data to Firebase
                await syncUserDataToFirebase(user.uid);
              }
              
              // Setup auto-sync
              setupAutoSync(user.uid);
              setDataSynced(true);
            } catch (syncError) {
              console.error('AuthContext: Error syncing user data:', syncError);
            }
          }
        } else {
          setUserProfile(null);
          setDataSynced(false);
        }
        setUser(user);
      } catch (error) {
        console.error('Error getting user profile:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [dataSynced]);

  const signInGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signInAnonymous = async () => {
    try {
      await signInAnonymousUser();
    } catch (error) {
      console.error('Error signing in anonymously:', error);
      throw error;
    }
  };

  const signInEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Error signing in with email:', error);
      if (error.code === 'auth/user-not-found') {
        throw new Error('Email tidak terdaftar');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Password salah');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Format email tidak valid');
      }
      throw error;
    }
  };

  const signUpEmail = async (email: string, password: string, displayName: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (result.user) {
        await updateProfile(result.user, { displayName });
      }
    } catch (error: any) {
      console.error('Error signing up with email:', error);
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email sudah terdaftar');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Format email tidak valid');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password terlalu lemah');
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Sync data before logout (if user is not anonymous)
      if (user && !user.isAnonymous) {
        await syncUserDataToFirebase(user.uid);
      }
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signInGoogle,
    signInAnonymous,
    signInEmail,
    signUpEmail,
    logout,
    isAuthenticated: !!user,
    isSuperAdminUser: userProfile?.role === 'superadmin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};