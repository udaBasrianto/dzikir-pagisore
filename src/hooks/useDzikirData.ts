import { useState, useEffect, useCallback } from 'react';
import { getDzikirsByCategory, DzikirItem as FirebaseDzikirItem } from '@/services/dzikirService';
import { dzikirPagiData, dzikirPetangData, DzikirItem } from '@/data/dzikirData';

export interface DzikirData {
  pagi: DzikirItem[];
  petang: DzikirItem[];
  umum: DzikirItem[];
}

export const useDzikirData = () => {
  const [data, setData] = useState<DzikirData>({
    pagi: dzikirPagiData,
    petang: dzikirPetangData,
    umum: []
  });
  const [loading, setLoading] = useState(false);

  // Convert Firebase dzikir to match local format
  const convertFirebaseDzikir = useCallback((data: FirebaseDzikirItem[]): DzikirItem[] => {
    return data.map(item => ({
      id: parseInt(item.id) || Math.random() * 1000000, // Generate unique ID
      title: item.title,
      arabic: item.arabic,
      transliteration: item.transliteration,
      translation: item.translation,
      count: item.count,
      category: item.category
    }));
  }, []);

  // Refresh dzikir data from Firebase
  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [pagiData, petangData, umumData] = await Promise.all([
        getDzikirsByCategory('pagi'),
        getDzikirsByCategory('petang'),
        getDzikirsByCategory('umum')
      ]);
      
      const firebasePagiDzikir = convertFirebaseDzikir(pagiData);
      const firebasePetangDzikir = convertFirebaseDzikir(petangData);
      const firebaseUmumDzikir = convertFirebaseDzikir(umumData);
      
      setData({
        pagi: [...dzikirPagiData, ...firebasePagiDzikir],
        petang: [...dzikirPetangData, ...firebasePetangDzikir],
        umum: [...firebaseUmumDzikir]
      });
    } catch (error) {
      console.error('Error loading Firebase dzikir:', error);
    } finally {
      setLoading(false);
    }
  }, [convertFirebaseDzikir]);

  // Initial load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    data,
    loading,
    refreshData
  };
};