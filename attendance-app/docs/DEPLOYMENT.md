# Absensi Karyawan Berbasis Face Recognition - Deployment Guide

Panduan langkah demi langkah untuk melakukan deploy aplikasi ke Vercel (Frontend), Node.js Express (Backend), dan Google Apps Script (Database REST API).

---

## 1. Google Apps Script Deployment (Backend REST API)

1. Buka [Google Sheets Database](https://docs.google.com/spreadsheets/d/1cJM7tAYKsfeTv7owtIunLIKxmLpSGQ9qqmR18h_Omd4/edit).
2. Klik **Extensions > Apps Script** di menu atas.
3. Salin isi kode dari file [`attendance-app/backend/google-apps-script/Code.gs`](file:///d:/Aplikasi/absensi/attendance-app/backend/google-apps-script/Code.gs).
4. Klik **Deploy > New Deployment**.
5. Pilih type: **Web App**.
6. Atur konfigurasi:
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
7. Klik **Deploy**, lalu berikan izin otorisasi Google Account.
8. Salin **Web App URL** (misalnya `https://script.google.com/macros/s/.../exec`).

---

## 2. Backend Node.js Express Deployment

### Prasyarat:
- Node.js v18+ atau v20+
- Environment Variable `.env`:
  ```env
  PORT=5000
  JWT_SECRET=your_super_secret_jwt_key_2026
  GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/AKfycbzOHaNtWI6vARI8aMnkoJh6oC06AzDR1sHDd21Q5R8VhqgG5f1soYnSNmIJHvXzjOM/exec
  GOOGLE_SHEET_ID=1cJM7tAYKsfeTv7owtIunLIKxmLpSGQ9qqmR18h_Omd4
  ```

### Jalankan Lokal / Server VPS:
```bash
cd attendance-app/backend
npm install
npm start
```

---

## 3. Frontend React + Tailwind Deployment (Vercel)

### Prasyarat:
- Node.js & Vercel CLI atau GitHub Repository integration.

### Jalankan Lokal:
```bash
cd attendance-app/frontend
npm install
npm run dev
```

### Deploy ke Vercel:
1. Dorong kode `frontend` ke GitHub.
2. Buka dashboard [Vercel](https://vercel.com).
3. Buat **New Project** dan sambungkan repository GitHub.
4. Set **Build Command**: `npm run build`
5. Set **Output Directory**: `dist`
6. Tambahkan Environment Variable:
   - `VITE_API_BASE_URL`: `http://localhost:5000/api` atau URL backend produksi.
   - `VITE_GOOGLE_SCRIPT_URL`: `https://script.google.com/macros/s/AKfycbzOHaNtWI6vARI8aMnkoJh6oC06AzDR1sHDd21Q5R8VhqgG5f1soYnSNmIJHvXzjOM/exec`
7. Klik **Deploy**.
