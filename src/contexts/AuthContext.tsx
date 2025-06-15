import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithGoogle, signInAnonymousUser, signOut, isSuperAdmin } from '@/config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

export type UserRole = 'superadmin' | 'admin' | 'contributor' | 'user' | 'anonymous';

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

    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: data.role || (isSuperAdmin(user) ? 'superadmin' : 'user'),
        isAnonymous: false,
        createdAt: data.createdAt?.toDate() || new Date()
      };
    } else {
      // Create new user profile
      const role: UserRole = isSuperAdmin(user) ? 'superadmin' : 'user';
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
        } else {
          setUserProfile(null);
        }
        setUser(user);
      } catch (error) {
        console.error('Error getting user profile:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

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

  const logout = async () => {
    try {
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
    logout,
    isAuthenticated: !!user,
    isSuperAdminUser: userProfile?.role === 'superadmin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};