# Panduan Dzikir Pagi Petang

Aplikasi Progressive Web App (PWA) untuk panduan dzikir pagi dan petang sesuai sunnah Rasulullah SAW.

## Fitur Utama

### 🔥 Fitur Baru dengan Firebase
- **Anonymous Authentication**: Otomatis login tanpa registrasi
- **Real-time Database**: Data statistik global yang update secara real-time
- **Offline Support**: Tetap berfungsi meski tanpa internet dengan cache localStorage
- **Global Statistics**: 
  - Total dzikir dibaca oleh semua pengguna
  - Jumlah aplikasi terinstall 
  - Pengguna aktif harian

### 📱 PWA Features
- **Installable**: Dapat diinstall seperti aplikasi native
- **Offline Ready**: Service Worker untuk cache dan akses offline
- **Responsive**: Optimal di semua perangkat

### 🎯 Fitur Dzikir
- **Dzikir Pagi & Petang**: Koleksi lengkap dzikir sesuai sunnah
- **Audio Player**: Suara bacaan dzikir dengan voice yang jernih
- **Counter Otomatis**: Hitung otomatis setiap dzikir yang dibaca
- **Progress Tracking**: Lacak kemajuan harian dan streak
- **Calendar View**: Visualisasi progress dalam bentuk kalender

### 🎨 UI/UX Features
- **Tema Hijau**: Desain yang menenangkan dengan warna hijau sebagai primary
- **Dark/Light Mode**: Mendukung kedua mode tema
- **Animasi Smooth**: Transisi dan animasi yang halus
- **Floating Action Button**: Akses cepat ke fitur tambahan

### 📊 Analytics & Tracking
- **Mood Tracker**: Catat mood sebelum dan sesudah dzikir
- **Streak Counter**: Hitung berapa hari berturut-turut dzikir
- **Share Progress**: Bagikan kemajuan ke media sosial
- **Custom Dzikir**: Tambah dzikir personal

## Setup Firebase (Wajib!)

1. Buat project Firebase di [console.firebase.google.com](https://console.firebase.google.com)
2. Aktifkan Authentication dengan Anonymous provider
3. Buat Firestore database dengan rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /stats/{document} {
         allow read, write: if request.auth != null;
       }
       match /activeUsers/{document} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
4. Update konfigurasi Firebase di `src/config/firebase.ts`:
   ```typescript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com", 
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "your-app-id"
   };
   ```

## Struktur Database Firebase

### Collection: `stats`
```javascript
{
  "globalStats": {
    "totalReads": number,
    "appInstalls": number, 
    "activeUsers": number,
    "lastUpdated": timestamp
  }
}
```

### Collection: `activeUsers`
```javascript
{
  "2024-06-13": {
    "date": "Wed Jun 13 2024",
    "count": 1,
    "timestamp": timestamp
  }
}
```

## Teknologi

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn/ui
- **Database**: Firebase Firestore
- **Authentication**: Firebase Anonymous Auth
- **PWA**: Service Worker, Web App Manifest
- **State Management**: React Hooks, Context API
- **Audio**: Web Audio API

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Fitur Offline

Aplikasi menggunakan strategi hybrid:
- **Online**: Data real-time dari Firebase
- **Offline**: Fallback ke localStorage
- **Sync**: Auto-sync ketika online kembali

## Kontribusi

Kontribusi sangat diterima! Silakan buat issue atau pull request.

## Lisensi

MIT License - Silakan gunakan untuk keperluan dakwah dan edukasi.

---

**Barakallahu fiikum** 🤲