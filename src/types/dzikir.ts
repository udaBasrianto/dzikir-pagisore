export interface DzikirItem {
  id: number;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  count: number;
  category?: string;
}

export interface FirebaseDzikirItem {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  count: number;
  category: 'pagi' | 'petang' | 'umum';
}