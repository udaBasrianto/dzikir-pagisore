import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Search, 
  Crown, 
  Shield, 
  User, 
  UserPlus,
  MoreHorizontal,
  ShieldAlert
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getAllUsers, updateUserRole, UserData } from '@/services/userService';
import { UserRole } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useUserRole } from '@/hooks/useUserRole';

const roleConfig = {
  superadmin: { label: 'Super Admin', icon: Crown, color: 'bg-purple-500' },
  admin: { label: 'Admin', icon: Shield, color: 'bg-blue-500' },
  contributor: { label: 'Kontributor', icon: UserPlus, color: 'bg-green-500' },
  user: { label: 'User', icon: User, color: 'bg-gray-500' }
};

export const UserManagement: React.FC = () => {
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');

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

  const handleRoleChange = async (uid: string, newRole: UserRole) => {
    try {
      await updateUserRole(uid, newRole);
      setUsers(users.map(user => 
        user.uid === uid ? { ...user, role: newRole } : user
      ));
      toast.success('Role pengguna berhasil diubah');
    } catch (error) {
      toast.error('Gagal mengubah role pengguna');
      console.error(error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role: UserRole) => {
    const config = roleConfig[role] || roleConfig.user;
    const Icon = config.icon;
    return <Icon className="w-4 h-4" />;
  };

  const getRoleBadge = (role: UserRole) => {
    const config = roleConfig[role] || roleConfig.user;
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        {getRoleIcon(role)}
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <p className="text-2xl font-bold">
                  {users.filter(u => u.role === 'admin' || u.role === 'superadmin').length}
                </p>
              </div>
              <Shield className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Kontributor</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.role === 'contributor').length}
                </p>
              </div>
              <UserPlus className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Regular Users</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.role === 'user').length}
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
          <CardTitle>Manajemen Pengguna</CardTitle>
          
          {/* Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari pengguna..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterRole} onValueChange={(value) => setFilterRole(value as UserRole | 'all')}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Role</SelectItem>
                <SelectItem value="superadmin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="contributor">Kontributor</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
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
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.uid}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${roleConfig[user.role].color}`}>
                          {user.displayName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{user.displayName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      {user.createdAt.toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {user.role !== 'superadmin' && (
                            <>
                              <DropdownMenuItem onClick={() => handleRoleChange(user.uid, 'admin')}>
                                Jadikan Admin
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleRoleChange(user.uid, 'contributor')}>
                                Jadikan Kontributor
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleRoleChange(user.uid, 'user')}>
                                Jadikan User
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
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