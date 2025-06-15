import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  Settings, 
  BarChart3, 
  ArrowLeft,
  Crown,
  Shield,
  User,
  UserPlus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserManagement } from './UserManagement';
import { DzikirManagement } from './DzikirManagement';
import { AdminStats } from './AdminStats';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!userProfile || userProfile.role !== 'superadmin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">Akses Ditolak</h2>
            <p className="text-muted-foreground mb-4">
              Anda tidak memiliki izin untuk mengakses halaman admin.
            </p>
            <Button onClick={onClose}>Kembali</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onClose}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Dashboard Admin
              </h1>
              <p className="text-muted-foreground">
                Kelola pengguna dan konten dzikir
              </p>
            </div>
          </div>
          <Badge variant="default" className="flex items-center gap-2">
            <Crown className="w-4 h-4" />
            Super Admin
          </Badge>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Pengguna
            </TabsTrigger>
            <TabsTrigger value="dzikirs" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Dzikir
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Pengaturan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminStats />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="dzikirs">
            <DzikirManagement />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Sistem</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Maintenance Mode</h3>
                      <p className="text-sm text-muted-foreground">
                        Aktifkan mode maintenance untuk pemeliharaan sistem
                      </p>
                    </div>
                    <Button variant="outline">
                      Nonaktif
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Backup Database</h3>
                      <p className="text-sm text-muted-foreground">
                        Buat backup manual database dzikir
                      </p>
                    </div>
                    <Button variant="outline">
                      Buat Backup
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Reset Statistics</h3>
                      <p className="text-sm text-muted-foreground">
                        Reset semua statistik global aplikasi
                      </p>
                    </div>
                    <Button variant="destructive">
                      Reset
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};