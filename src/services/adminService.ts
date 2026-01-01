import { supabase } from '@/integrations/supabase/client';

// Single admin email - only this user can manage content
const ADMIN_EMAIL = 'mas@abd.com';

// Check if user is admin (simplified - only 1 admin)
export const checkAdminStatus = async (
  firebaseUid: string, 
  email: string
): Promise<{ isAdmin: boolean; role: 'superadmin' | 'admin' | null }> => {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    
    // Only mas@abd.com is admin
    if (normalizedEmail === ADMIN_EMAIL) {
      // Update firebase_uid in database
      await supabase
        .from('admin_users')
        .update({ firebase_uid: firebaseUid })
        .eq('email', ADMIN_EMAIL);
      
      return { isAdmin: true, role: 'superadmin' };
    }
    
    return { isAdmin: false, role: null };
  } catch (error) {
    console.error('Error checking admin status:', error);
    return { isAdmin: false, role: null };
  }
};

// Check if email is admin
export const isAdminEmail = (email: string): boolean => {
  return email.toLowerCase().trim() === ADMIN_EMAIL;
};

// Get admin email
export const getAdminEmail = (): string => {
  return ADMIN_EMAIL;
};
