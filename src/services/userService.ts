import { db } from '@/config/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  updateDoc, 
  query, 
  orderBy,
  where
} from 'firebase/firestore';
import { UserRole } from '@/contexts/AuthContext';

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: Date;
  lastActive?: Date;
}

// Get all users (admin only)
export const getAllUsers = async (): Promise<UserData[]> => {
  try {
    const q = query(
      collection(db, 'users'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      lastActive: doc.data().lastActive?.toDate()
    })) as UserData[];
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
};

// Update user role
export const updateUserRole = async (uid: string, role: UserRole): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      role,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

// Get user by email
export const getUserByEmail = async (email: string): Promise<UserData | null> => {
  try {
    const q = query(
      collection(db, 'users'),
      where('email', '==', email)
    );
    
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return {
      uid: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      lastActive: doc.data().lastActive?.toDate()
    } as UserData;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
};

// Get users by role
export const getUsersByRole = async (role: UserRole): Promise<UserData[]> => {
  try {
    const q = query(
      collection(db, 'users'),
      where('role', '==', role),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      lastActive: doc.data().lastActive?.toDate()
    })) as UserData[];
  } catch (error) {
    console.error('Error getting users by role:', error);
    return [];
  }
};