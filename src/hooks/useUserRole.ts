import { useAuth } from '@/contexts/AuthContext';

export type UserRole = 'admin' | 'superadmin' | 'user' | 'anonymous';

export const useUserRole = () => {
  const { userProfile, loading } = useAuth();
  
  const role: UserRole = (userProfile?.role as UserRole) || 'user';
  const isAdmin = role === 'admin' || role === 'superadmin';
  
  return { role, loading, isAdmin };
};
