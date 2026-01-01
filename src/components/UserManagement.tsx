import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Search, 
  Crown, 
  Shield, 
  User, 
  ShieldAlert
} from 'lucide-react';
import { getAllUsers, UserData } from '@/services/userService';
import { UserRole } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useUserRole } from '@/hooks/useUserRole';
import { isAdminEmail } from '@/services/adminService';

const roleConfig = {
  superadmin: { label: 'Super Admin', icon: Crown, color: 'bg-amber-500' },
  admin: { label: 'Admin', icon: Shield, color: 'bg-blue-500' },
  user: { label: 'User', icon: User, color: 'bg-gray-500' },
  anonymous: { label: 'Tamu', icon: User, color: 'bg-gray-400' }
};

export const UserManagement: React.FC = () => {
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Block non-admin access
  if (!roleLoading && !isAdmin) {
    return (
      <Card className="border-destructive">
        <CardContent className="p-8 text-center">
          <ShieldAlert className="w-16 h-16 mx-auto text-destructive mb-4" />
          <h3 className="text-xl font-semibold mb-2">Akses Ditolak</h3>
          <p className="text-muted-foreground">
            Hanya admin yang dapat mengakses halaman manajemen pengguna.
          </p>
        </CardContent>
      </Card>
    );
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const userData = await getAllUsers();
      setUsers(userData);
    } catch (error) {
      toast.error('Gagal memuat data pengguna');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getRoleIcon = (role: UserRole) => {
    const config = roleConfig[role] || roleConfig.user;
    const Icon = config.icon;
    return <Icon className="w-4 h-4" />;
  };

  const getRoleBadge = (user: UserData) => {
    // Check if this user is the admin
    if (isAdminEmail(user.email)) {
      return (
        <Badge className="flex items-center gap-1 bg-amber-500/10 text-amber-600 border-amber-500/20">
          <Crown className="w-3 h-3" />
          Super Admin
        </Badge>
      );
    }
    
    const config = roleConfig.user;
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        {getRoleIcon('user')}
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Admin</p>
                <p className="text-2xl font-bold">1</p>
              </div>
              <Shield className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Regular Users</p>
                <p className="text-2xl font-bold">
                  {Math.max(0, users.length - 1)}
                </p>
              </div>
              <User className="w-8 h-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari pengguna..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pengguna</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Terdaftar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.uid}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${isAdminEmail(user.email) ? 'bg-amber-500' : 'bg-gray-500'}`}>
                          {user.displayName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{user.displayName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user)}</TableCell>
                    <TableCell>
                      {user.createdAt.toLocaleDateString('id-ID')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
