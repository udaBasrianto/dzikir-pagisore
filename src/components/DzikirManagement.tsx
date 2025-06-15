import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Clock,
  Home,
  BookOpen
} from 'lucide-react';
import { 
  getAllDzikirs, 
  addDzikir, 
  updateDzikir, 
  deleteDzikir,
  DzikirItem 
} from '@/services/dzikirService';
import { toast } from 'sonner';

const categoryConfig = {
  pagi: { label: 'Dzikir Pagi', icon: Clock, color: 'bg-orange-500' },
  petang: { label: 'Dzikir Petang', icon: Home, color: 'bg-blue-500' },
  umum: { label: 'Doa Umum', icon: BookOpen, color: 'bg-green-500' }
};

export const DzikirManagement: React.FC = () => {
  const [dzikirs, setDzikirs] = useState<DzikirItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'pagi' | 'petang' | 'umum'>('all');
  const [editingDzikir, setEditingDzikir] = useState<DzikirItem | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    loadDzikirs();
  }, []);

  const loadDzikirs = async () => {
    try {
      setLoading(true);
      const dzikirData = await getAllDzikirs();
      setDzikirs(dzikirData);
    } catch (error) {
      toast.error('Gagal memuat data dzikir');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDzikir = async (data: Omit<DzikirItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addDzikir(data);
      await loadDzikirs();
      setShowAddDialog(false);
      toast.success('Dzikir berhasil ditambahkan');
    } catch (error) {
      toast.error('Gagal menambahkan dzikir');
      console.error(error);
    }
  };

  const handleUpdateDzikir = async (id: string, data: Partial<DzikirItem>) => {
    try {
      await updateDzikir(id, data);
      await loadDzikirs();
      setEditingDzikir(null);
      toast.success('Dzikir berhasil diupdate');
    } catch (error) {
      toast.error('Gagal mengupdate dzikir');
      console.error(error);
    }
  };

  const handleDeleteDzikir = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus dzikir ini?')) {
      try {
        await deleteDzikir(id);
        await loadDzikirs();
        toast.success('Dzikir berhasil dihapus');
      } catch (error) {
        toast.error('Gagal menghapus dzikir');
        console.error(error);
      }
    }
  };

  const filteredDzikirs = dzikirs.filter(dzikir => {
    const matchesSearch = dzikir.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dzikir.arabic.includes(searchTerm) ||
                         dzikir.transliteration.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || dzikir.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadge = (category: 'pagi' | 'petang' | 'umum') => {
    const config = categoryConfig[category];
    const Icon = config.icon;
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
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
                <p className="text-sm text-muted-foreground">Total Dzikir</p>
                <p className="text-2xl font-bold">{dzikirs.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Dzikir Pagi</p>
                <p className="text-2xl font-bold">
                  {dzikirs.filter(d => d.category === 'pagi').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Dzikir Petang</p>
                <p className="text-2xl font-bold">
                  {dzikirs.filter(d => d.category === 'petang').length}
                </p>
              </div>
              <Home className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Doa Umum</p>
                <p className="text-2xl font-bold">
                  {dzikirs.filter(d => d.category === 'umum').length}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dzikir Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Manajemen Dzikir</CardTitle>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Dzikir
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Tambah Dzikir Baru</DialogTitle>
                </DialogHeader>
                <DzikirForm onSubmit={handleAddDzikir} onCancel={() => setShowAddDialog(false)} />
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari dzikir..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value as any)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                <SelectItem value="pagi">Dzikir Pagi</SelectItem>
                <SelectItem value="petang">Dzikir Petang</SelectItem>
                <SelectItem value="umum">Doa Umum</SelectItem>
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
                  <TableHead>Judul</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dibuat</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDzikirs.map((dzikir) => (
                  <TableRow key={dzikir.id}>
                    <TableCell className="font-medium">{dzikir.title}</TableCell>
                    <TableCell>{getCategoryBadge(dzikir.category)}</TableCell>
                    <TableCell>{dzikir.count}x</TableCell>
                    <TableCell>
                      <Badge variant={dzikir.status === 'published' ? 'default' : 'secondary'}>
                        {dzikir.status === 'published' ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {dzikir.createdAt.toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setEditingDzikir(dzikir)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteDzikir(dzikir.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingDzikir && (
        <Dialog open={!!editingDzikir} onOpenChange={() => setEditingDzikir(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Dzikir</DialogTitle>
            </DialogHeader>
            <DzikirForm 
              dzikir={editingDzikir}
              onSubmit={(data) => handleUpdateDzikir(editingDzikir.id, data)}
              onCancel={() => setEditingDzikir(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Dzikir Form Component
interface DzikirFormProps {
  dzikir?: DzikirItem;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const DzikirForm: React.FC<DzikirFormProps> = ({ dzikir, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: dzikir?.title || '',
    arabic: dzikir?.arabic || '',
    transliteration: dzikir?.transliteration || '',
    translation: dzikir?.translation || '',
    count: dzikir?.count || 1,
    category: dzikir?.category || 'umum',
    status: dzikir?.status || 'published'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Judul</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Teks Arab</label>
        <Textarea
          value={formData.arabic}
          onChange={(e) => setFormData({ ...formData, arabic: e.target.value })}
          className="min-h-20 font-arabic text-right"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Transliterasi</label>
        <Textarea
          value={formData.transliteration}
          onChange={(e) => setFormData({ ...formData, transliteration: e.target.value })}
          className="min-h-16"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Terjemahan</label>
        <Textarea
          value={formData.translation}
          onChange={(e) => setFormData({ ...formData, translation: e.target.value })}
          className="min-h-16"
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">Jumlah</label>
          <Input
            type="number"
            min="1"
            value={formData.count}
            onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) })}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Kategori</label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value as any })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pagi">Dzikir Pagi</SelectItem>
              <SelectItem value="petang">Dzikir Petang</SelectItem>
              <SelectItem value="umum">Doa Umum</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Status</label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit">
          {dzikir ? 'Update' : 'Tambah'}
        </Button>
      </div>
    </form>
  );
};