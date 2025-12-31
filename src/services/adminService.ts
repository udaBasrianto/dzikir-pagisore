import { supabase } from '@/integrations/supabase/client';

export interface AdminUser {
  id: string;
  firebase_uid: string;
  email: string;
  role: 'superadmin' | 'admin';
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// Check if a user is admin by Firebase UID or email
export const checkAdminStatus = async (firebaseUid: string, email: string): Promise<{ isAdmin: boolean; role: 'superadmin' | 'admin' | null }> => {
  try {
    // First check by Firebase UID
    const { data: byUid } = await supabase
      .from('admin_users')
      .select('role')
      .eq('firebase_uid', firebaseUid)
      .maybeSingle();

    if (byUid) {
      return { isAdmin: true, role: byUid.role as 'superadmin' | 'admin' };
    }

    // Then check by email (for initial setup)
    const { data: byEmail } = await supabase
      .from('admin_users')
      .select('id, role, firebase_uid')
      .eq('email', email)
      .maybeSingle();

    if (byEmail) {
      // Update firebase_uid if it's the initial placeholder
      if (byEmail.firebase_uid === 'initial_superadmin') {
        await supabase
          .from('admin_users')
          .update({ firebase_uid: firebaseUid })
          .eq('id', byEmail.id);
      }
      return { isAdmin: true, role: byEmail.role as 'superadmin' | 'admin' };
    }

    return { isAdmin: false, role: null };
  } catch (error) {
    console.error('Error checking admin status:', error);
    return { isAdmin: false, role: null };
  }
};

// Get all admin users
export const getAllAdmins = async (): Promise<AdminUser[]> => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as AdminUser[];
  } catch (error) {
    console.error('Error fetching admins:', error);
    return [];
  }
};

// Add new admin
export const addAdmin = async (
  email: string, 
  role: 'admin' | 'superadmin',
  createdBy: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('admin_users')
      .insert({
        firebase_uid: `pending_${Date.now()}`, // Will be updated when user logs in
        email: email.toLowerCase().trim(),
        role,
        created_by: createdBy
      });

    if (error) {
      if (error.code === '23505') {
        return { success: false, error: 'Email sudah terdaftar sebagai admin' };
      }
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error adding admin:', error);
    return { success: false, error: error.message || 'Gagal menambahkan admin' };
  }
};

// Update admin role
export const updateAdminRole = async (
  adminId: string, 
  newRole: 'admin' | 'superadmin'
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('admin_users')
      .update({ role: newRole })
      .eq('id', adminId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error updating admin role:', error);
    return { success: false, error: error.message || 'Gagal mengubah role admin' };
  }
};

// Remove admin
export const removeAdmin = async (adminId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', adminId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error removing admin:', error);
    return { success: false, error: error.message || 'Gagal menghapus admin' };
  }
};
