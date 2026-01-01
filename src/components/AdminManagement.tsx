import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Mail, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getAdminEmail } from '@/services/adminService';

export const AdminManagement: React.FC = () => {
  const { userProfile } = useAuth();
  const adminEmail = getAdminEmail();
  const isCurrentUserAdmin = userProfile?.email === adminEmail;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Admin Aplikasi</h3>
        <p className="text-sm text-muted-foreground">
          Hanya ada satu admin untuk aplikasi ini
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-amber-500/10">
              <Crown className="w-8 h-8 text-amber-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{adminEmail}</span>
                {isCurrentUserAdmin && (
                  <Badge variant="secondary" className="text-xs">
                    Anda
                  </Badge>
                )}
              </div>
              <Badge className="mt-2 bg-amber-500/10 text-amber-600 border-amber-500/20">
                <Shield className="w-3 h-3 mr-1" />
                Super Admin
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Hak Akses Admin:</strong>
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
            <li>Mengelola dzikir dan doa</li>
            <li>Melihat statistik aplikasi</li>
            <li>Mengakses dashboard admin</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
