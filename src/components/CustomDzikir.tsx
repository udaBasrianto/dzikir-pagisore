import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, BookOpen, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CustomDzikirItem {
  id: string;
  title: string;
  arabic: string;
  translation: string;
  repetition: number;
  category: 'pagi' | 'petang' | 'umum';
  createdAt: string;
}

interface CustomDzikirProps {
  onClose?: () => void;
}

export const CustomDzikir: React.FC<CustomDzikirProps> = ({ onClose }) => {
  const [customDzikirs, setCustomDzikirs] = useState<CustomDzikirItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    arabic: '',
    translation: '',
    repetition: 1,
    category: 'umum' as 'pagi' | 'petang' | 'umum'
  });
  const { toast } = useToast();

  useEffect(() => {
    loadCustomDzikirs();
  }, []);

  const loadCustomDzikirs = () => {
    const saved = localStorage.getItem('custom-dzikirs');
    if (saved) {
      setCustomDzikirs(JSON.parse(saved));
    }
  };

  const saveCustomDzikirs = (dzikirs: CustomDzikirItem[]) => {
    localStorage.setItem('custom-dzikirs', JSON.stringify(dzikirs));
    setCustomDzikirs(dzikirs);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      arabic: '',
      translation: '',
      repetition: 1,
      category: 'umum'
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.arabic.trim()) {
      toast({
        title: "Field Wajib Kosong",
        description: "Mohon isi judul dan teks Arab dzikir.",
        variant: "destructive",
      });
      return;
    }

    if (editingId) {
      // Edit existing dzikir
      const updated = customDzikirs.map(item =>
        item.id === editingId
          ? { ...item, ...formData }
          : item
      );
      saveCustomDzikirs(updated);
      toast({
        title: "Dzikir Diperbarui! ✨",
        description: "Dzikir kustom Anda berhasil diperbarui.",
      });
    } else {
      // Add new dzikir
      const newDzikir: CustomDzikirItem = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      saveCustomDzikirs([...customDzikirs, newDzikir]);
      toast({
        title: "Dzikir Ditambahkan! 🎉",
        description: "Dzikir kustom Anda berhasil disimpan.",
      });
    }

    resetForm();
  };

  const handleEdit = (dzikir: CustomDzikirItem) => {
    setFormData({
      title: dzikir.title,
      arabic: dzikir.arabic,
      translation: dzikir.translation,
      repetition: dzikir.repetition,
      category: dzikir.category
    });
    setEditingId(dzikir.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    const updated = customDzikirs.filter(item => item.id !== id);
    saveCustomDzikirs(updated);
    toast({
      title: "Dzikir Dihapus",
      description: "Dzikir kustom berhasil dihapus.",
    });
  };

  const getCategoryBadge = (category: string) => {
    const badges = {
      pagi: { label: 'Pagi', variant: 'default' as const },
      petang: { label: 'Petang', variant: 'secondary' as const },
      umum: { label: 'Umum', variant: 'outline' as const }
    };
    return badges[category as keyof typeof badges] || badges.umum;
  };

  const groupedDzikirs = {
    pagi: customDzikirs.filter(d => d.category === 'pagi'),
    petang: customDzikirs.filter(d => d.category === 'petang'),
    umum: customDzikirs.filter(d => d.category === 'umum')
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          📖 Dzikir Kustom
        </h1>
        <p className="text-muted-foreground">
          Tambahkan dzikir pribadi dan doa pilihan Anda
        </p>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              {editingId ? 'Edit Dzikir' : 'Tambah Dzikir Baru'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Judul Dzikir</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                  placeholder="Contoh: Dzikir Setelah Sholat"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Teks Arab</label>
                <Textarea
                  value={formData.arabic}
                  onChange={(e) => setFormData(prev => ({...prev, arabic: e.target.value}))}
                  placeholder="اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ"
                  className="text-right font-arabic text-lg"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Terjemahan (Opsional)</label>
                <Textarea
                  value={formData.translation}
                  onChange={(e) => setFormData(prev => ({...prev, translation: e.target.value}))}
                  placeholder="Ya Allah, tolonglah aku untuk berdzikir kepada-Mu, bersyukur kepada-Mu, dan beribadah kepada-Mu dengan baik"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Jumlah Bacaan</label>
                  <Input
                    type="number"
                    min="1"
                    max="1000"
                    value={formData.repetition}
                    onChange={(e) => setFormData(prev => ({...prev, repetition: parseInt(e.target.value) || 1}))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({...prev, category: e.target.value as any}))}
                    className="w-full p-2 border border-border rounded-md bg-background"
                  >
                    <option value="umum">Umum</option>
                    <option value="pagi">Pagi</option>
                    <option value="petang">Petang</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? 'Perbarui' : 'Simpan'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="w-4 h-4 mr-2" />
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Add Button */}
      {!isAdding && (
        <Button onClick={() => setIsAdding(true)} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Dzikir Baru
        </Button>
      )}

      {/* Custom Dzikirs List */}
      {Object.entries(groupedDzikirs).map(([category, dzikirs]) => {
        if (dzikirs.length === 0) return null;
        
        const categoryNames = {
          pagi: '🌅 Dzikir Pagi',
          petang: '🌆 Dzikir Petang',
          umum: '📿 Dzikir Umum'
        };

        return (
          <div key={category} className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">
              {categoryNames[category as keyof typeof categoryNames]}
            </h3>
            
            {dzikirs.map((dzikir) => (
              <Card key={dzikir.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{dzikir.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge {...getCategoryBadge(dzikir.category)}>
                          {getCategoryBadge(dzikir.category).label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {dzikir.repetition}x
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(dzikir)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(dzikir.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-right font-arabic text-lg text-foreground leading-relaxed">
                      {dzikir.arabic}
                    </p>
                    {dzikir.translation && (
                      <p className="text-sm text-muted-foreground italic">
                        "{dzikir.translation}"
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );
      })}

      {customDzikirs.length === 0 && !isAdding && (
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-2">
              Belum Ada Dzikir Kustom
            </h3>
            <p className="text-sm text-muted-foreground">
              Tambahkan dzikir pribadi atau doa pilihan Anda untuk membuat pengalaman berdzikir lebih personal.
            </p>
          </CardContent>
        </Card>
      )}

      {onClose && (
        <Button onClick={onClose} variant="outline" className="w-full">
          Kembali
        </Button>
      )}
    </div>
  );
};