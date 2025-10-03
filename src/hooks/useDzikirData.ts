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

  // Refresh dzikir data from Firebase
  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [pagiData, petangData, umumData] = await Promise.all([
        getDzikirsByCategory('pagi'),
        getDzikirsByCategory('petang'),
        getDzikirsByCategory('umum')
      ]);
      
      // Convert Firebase dzikir to match local format
      const convertData = (data: FirebaseDzikirItem[]): DzikirItem[] => {
        return data.map((item, index) => ({
          id: item.id ? parseInt(item.id.replace(/\D/g, '')) || (Date.now() + index) : (Date.now() + index),
          title: item.title,
          arabic: item.arabic,
          transliteration: item.transliteration,
          translation: item.translation,
          count: item.count,
          category: item.category
        }));
      };
      
      const firebasePagiDzikir = convertData(pagiData);
      const firebasePetangDzikir = convertData(petangData);
      const firebaseUmumDzikir = convertData(umumData);
      
      // Prioritize Firebase data, fallback to static data if empty
      setData({
        pagi: firebasePagiDzikir.length > 0 ? [...dzikirPagiData, ...firebasePagiDzikir] : dzikirPagiData,
        petang: firebasePetangDzikir.length > 0 ? [...dzikirPetangData, ...firebasePetangDzikir] : dzikirPetangData,
        umum: firebaseUmumDzikir
      });
    } catch (error) {
      console.error('Error loading Firebase dzikir:', error);
      // Fallback to static data on error
      setData({
        pagi: dzikirPagiData,
        petang: dzikirPetangData,
        umum: []
      });
    } finally {
      setLoading(false);
    }
  }, []);

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