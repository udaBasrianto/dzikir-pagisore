import { db } from '@/config/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  setDoc,
  writeBatch
} from 'firebase/firestore';

export interface DzikirItem {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  count: number;
  category: 'pagi' | 'petang' | 'umum';
  status: 'published' | 'draft';
  author?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  order: number;
}

// Get all dzikirs by category
export const getDzikirsByCategory = async (category: 'pagi' | 'petang' | 'umum'): Promise<DzikirItem[]> => {
  try {
    const q = query(
      collection(db, 'dzikirs'),
      where('category', '==', category),
      where('status', '==', 'published'),
      orderBy('createdAt', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as DzikirItem[];
  } catch (error) {
    console.error('Error getting dzikirs by category:', error);
    return [];
  }
};

// Get all dzikirs (for admin)
export const getAllDzikirs = async (): Promise<DzikirItem[]> => {
  try {
    const q = query(collection(db, 'dzikirs'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as DzikirItem[];
  } catch (error) {
    console.error('Error getting all dzikirs:', error);
    return [];
  }
};

// Add new dzikir
export const addDzikir = async (dzikirData: Omit<DzikirItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const now = new Date();
    const docRef = await addDoc(collection(db, 'dzikirs'), {
      ...dzikirData,
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding dzikir:', error);
    throw error;
  }
};

// Update dzikir
export const updateDzikir = async (id: string, updates: Partial<DzikirItem>): Promise<void> => {
  try {
    const docRef = doc(db, 'dzikirs', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating dzikir:', error);
    throw error;
  }
};

// Delete dzikir
export const deleteDzikir = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'dzikirs', id));
  } catch (error) {
    console.error('Error deleting dzikir:', error);
    throw error;
  }
};

// Get categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Category[];
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
};

// Initialize default categories and migrate data
export const initializeDefaultData = async (): Promise<void> => {
  try {
    const batch = writeBatch(db);

    // Create default categories
    const categories = [
      { id: 'pagi', name: 'Dzikir Pagi', description: 'Dzikir dan doa untuk memulai hari', order: 1 },
      { id: 'petang', name: 'Dzikir Petang', description: 'Dzikir dan doa untuk mengakhiri hari', order: 2 },
      { id: 'umum', name: 'Doa Umum', description: 'Doa dan dzikir umum sehari-hari', order: 3 }
    ];

    categories.forEach(category => {
      const categoryRef = doc(db, 'categories', category.id);
      batch.set(categoryRef, category);
    });

    await batch.commit();
    console.log('Default categories initialized');
  } catch (error) {
    console.error('Error initializing default data:', error);
  }
};