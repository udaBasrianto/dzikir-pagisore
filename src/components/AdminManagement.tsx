import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Shield, 
  Crown, 
  UserPlus, 
  Trash2, 
  Loader2,
  Mail,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getAllAdmins, 
  addAdmin, 
  updateAdminRole, 
  removeAdmin,
  AdminUser 
} from '@/services/adminService';

export const AdminManagement: React.FC = () => {
  const { userProfile } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'admin' | 'superadmin'>('admin');
  const [dialogOpen, setDialogOpen] = useState(false);

  const isSuperAdmin = userProfile?.role === 'superadmin';

  const loadAdmins = async () => {
    setLoading(true);
    const data = await getAllAdmins();
    setAdmins(data);
    setLoading(false);
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleAddAdmin = async () => {
    if (!newAdminEmail.trim()) {
      toast.error('Email tidak boleh kosong');
      return;
    }

    if (!newAdminEmail.includes('@')) {
      toast.error('Format email tidak valid');
      return;
    }

    setAddingAdmin(true);
    const result = await addAdmin(
      newAdminEmail,
      newAdminRole,
      userProfile?.email || 'unknown'
    );

    if (result.success) {
      toast.success('Admin berhasil ditambahkan');
      setNewAdminEmail('');
      setNewAdminRole('admin');
      setDialogOpen(false);
      await loadAdmins();
    } else {
      toast.error(result.error || 'Gagal menambahkan admin');
    }
    setAddingAdmin(false);
  };

  const handleUpdateRole = async (adminId: string, newRole: 'admin' | 'superadmin') => {
    const result = await updateAdminRole(adminId, newRole);
    if (result.success) {
      toast.success('Role berhasil diubah');
      await loadAdmins();
    } else {
      toast.error(result.error || 'Gagal mengubah role');
    }
  };

  const handleRemoveAdmin = async (adminId: string) => {
    const result = await removeAdmin(adminId);
    if (result.success) {
      toast.success('Admin berhasil dihapus');
      await loadAdmins();
    } else {
      toast.error(result.error || 'Gagal menghapus admin');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Memuat data admin...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Kelola Admin</h3>
          <p className="text-sm text-muted-foreground">
            Tambah atau hapus admin aplikasi
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Tambah Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Admin Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Admin akan aktif saat user login dengan email ini
                </p>
              </div>
              
              {isSuperAdmin && (
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={newAdminRole} onValueChange={(v) => setNewAdminRole(v as 'admin' | 'superadmin')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="superadmin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Batal</Button>
              </DialogClose>
              <Button onClick={handleAddAdmin} disabled={addingAdmin}>
                {addingAdmin ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menambahkan...
                  </>
                ) : (
                  'Tambah Admin'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Crown className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {admins.filter(a => a.role === 'superadmin').length}
              </p>
              <p className="text-xs text-muted-foreground">Super Admin</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Shield className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {admins.filter(a => a.role === 'admin').length}
              </p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daftar Admin</CardTitle>
        </CardHeader>
        <CardContent>
          {admins.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Belum ada admin terdaftar
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Ditambahkan</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{admin.email}</span>
                        {admin.firebase_uid.startsWith('pending_') && (
                          <Badge variant="outline" className="text-xs">
                            Pending
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {admin.role === 'superadmin' ? (
                        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                          <Crown className="w-3 h-3 mr-1" />
                          Super Admin
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                          <Shield className="w-3 h-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {formatDate(admin.created_at)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isSuperAdmin && admin.email !== userProfile?.email && (
                          <>
                            <Select
                              value={admin.role}
                              onValueChange={(v) => handleUpdateRole(admin.id, v as 'admin' | 'superadmin')}
                            >
                              <SelectTrigger className="w-32 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="superadmin">Super Admin</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Hapus Admin?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Anda yakin ingin menghapus <strong>{admin.email}</strong> dari daftar admin?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleRemoveAdmin(admin.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Hapus
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                        {admin.email === userProfile?.email && (
                          <Badge variant="secondary" className="text-xs">
                            Anda
                          </Badge>
                        )}
                      </div>
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
