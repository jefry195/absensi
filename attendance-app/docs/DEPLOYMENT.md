# Absensi Karyawan Berbasis Face Recognition - Deployment Guide

Panduan langkah demi langkah untuk melakukan deploy aplikasi ke Vercel (Frontend), Node.js Express (Backend), dan Google Apps Script (Database REST API).

🌐 **Live Vercel Production URL**: [https://absensi-alpha-navy.vercel.app](https://absensi-alpha-navy.vercel.app)

---

## 1. Vercel Deployment (Frontend Single Page Application)

### Konfigurasi `vercel.json` (Root & Frontend):
File `vercel.json` telah dikonfigurasi untuk mencegah error 404 pada SPA routes:

```json
{
  "version": 2,
  "name": "absensi-karyawan-face-recognition",
  "cleanUrls": true,
  "trailingSlash": false,
  "routes": [
    { "src": "/assets/(.*)", "dest": "/assets/$1" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

### Langkah Deploy Vercel:
1. Hubungkan repository GitHub [https://github.com/jefry195/absensi](https://github.com/jefry195/absensi) ke Vercel Dashboard.
2. Setiap kali ada commit baru ke branch `main`, Vercel secara otomatis melakukan pembaharuan build dan deployment.
3. Aplikasi siap diakses secara HTTPS di [https://absensi-alpha-navy.vercel.app](https://absensi-alpha-navy.vercel.app).

---

## 2. Google Apps Script Deployment (Backend REST API)

1. Buka [Google Sheets Database](https://docs.google.com/spreadsheets/d/1cJM7tAYKsfeTv7owtIunLIKxmLpSGQ9qqmR18h_Omd4/edit).
2. Klik **Extensions > Apps Script** di menu atas.
3. Salin isi kode dari file [`attendance-app/backend/google-apps-script/Code.gs`](file:///d:/Aplikasi/absensi/attendance-app/backend/google-apps-script/Code.gs).
4. Klik **Deploy > New Deployment**.
5. Pilih type: **Web App**.
6. Atur konfigurasi:
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
7. Klik **Deploy**, lalu berikan izin otorisasi Google Account.
8. Salin **Web App URL** (`https://script.google.com/macros/s/AKfycbzOHaNtWI6vARI8aMnkoJh6oC06AzDR1sHDd21Q5R8VhqgG5f1soYnSNmIJHvXzjOM/exec`).

---

## 3. Backend Node.js Express Deployment

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
