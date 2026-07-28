# Absensi Karyawan Berbasis Face Recognition & GPS Geofence

![Lumina FaceTrack AI](assets/logo.png)

Aplikasi **Absensi Karyawan Berbasis Face Recognition & GPS Geofence** modern, responsif, dan mudah digunakan berbasis teknologi Web. Sistem ini terintegrasi penuh dengan **Google Sheets** sebagai database utama, **Google Apps Script** sebagai REST API backend, serta **OpenStreetMap & Leaflet.js** untuk penentuan radius geofence lokasi kantor berbasis **Formula Haversine**.

🌐 **Live Vercel Deployment**: [https://absensi-alpha-navy.vercel.app](https://absensi-alpha-navy.vercel.app)

---

## 🚀 Fitur Utama

### 1. 👤 Presensi Berbasis Face Recognition & Liveness Detection
- **Tingkat Kemiripan (Face Similarity Score)**: Verifikasi presensi berbasis pencocokan vektor wajah (Syarat minimal **≥ 90%**).
- **Liveness Detection**: Deteksi kedipan mata (**Blink Detection**) dan gerakan kepala (**Head Movement Detection**).
- **Keamanan Anti-Spoofing**: Dilengkapi fitur Anti-Foto, Anti-Screenshot, dan pengambil foto selfie otomatis saat presensi masuk & keluar.

### 2. 📍 GPS Geofencing & Formula Haversine
- Penentuan lokasi presensi berbasis **OpenStreetMap**, **Leaflet.js**, dan **HTML5 Geolocation**.
- Menghitung jarak presisi antara koordinat karyawan dan lokasi kantor menggunakan **Formula Haversine**.
- Validasi **Akurasi GPS (<30 meter)**.
- Pilihan Preset Radius Admin: **50m**, **100m**, **150m**, **300m**, **500m**, **1000m** yang tersimpan di Google Sheets dan langsung berlaku secara real-time.
- **Auto-Disable Button**: Tombol presensi otomatis nonaktif jika posisi karyawan di luar radius geofence kantor.

### 3. 📊 Integrasi Google Sheets Database & Apps Script API
- **Google Sheets (`DB_Absensi_Karyawan`)**:
  - `Users` Sheet (`gid=0`): Menyimpan ID, Nama, NIK, Email, Password Hash (bcrypt), Face Embedding Array, Divisi, dan Role.
  - `Attendance` Sheet (`gid=1528320542`): Menyimpan ID, UserID, Nama, Tanggal, Jam, CheckType, Latitude, Longitude, Distance, Similarity, SelfieURL, Status.
  - `Settings` Sheet (`gid=775821409`): Menyimpan Office Latitude, Office Longitude, dan Radius.
- **Google Apps Script REST API**:
  - Endpoints GET: `/users`, `/attendance`, `/settings`
  - Endpoints POST: `/login`, `/register`, `/checkin`, `/checkout`, `/update-settings`

### 4. 📈 Dashboard Admin & Laporan
- Ringkasan Statistik: Total Karyawan, Hadir Hari Ini, Terlambat, Tidak Hadir, Persentase Kehadiran %, dan Grafik Tren Presensi.
- Filter data presensi berdasarkan Nama, NIK, Tanggal, Divisi, dan Status.
- Fitur Ekspor Laporan ke format **Excel (.xlsx)**, **PDF**, dan **CSV**.

### 5. 🎁 Bonus Fitur Enterprise
- **Multi-Cabang**: Dukungan pengaturan lokasi & radius terpisah untuk setiap cabang (HQ Jakarta, Cabang Bandung, Cabang Surabaya).
- **Jadwal Shift**: Manajemen Shift Pagi (08:00 - 17:00) dan Shift Malam (20:00 - 05:00).
- **Izin & Cuti**: Form pengajuan izin/cuti dilengkapi unggah dokumen surat dokter atau tugas dinas.
- **QR Code Pass**: QR Code ID karyawan untuk pembuka portal kiosk gate presensi.

---

## 🌐 Tautan Live Deployment & Database
- **Live Vercel Web App**: [https://absensi-alpha-navy.vercel.app](https://absensi-alpha-navy.vercel.app)
- **GitHub Repository**: [https://github.com/jefry195/absensi](https://github.com/jefry195/absensi)
- **Google Sheets Database**: [DB_Absensi_Karyawan](https://docs.google.com/spreadsheets/d/1cJM7tAYKsfeTv7owtIunLIKxmLpSGQ9qqmR18h_Omd4/edit?usp=sharing)
- **Google Apps Script Execution Endpoint**: [GAS Web App](https://script.google.com/macros/s/AKfycbzOHaNtWI6vARI8aMnkoJh6oC06AzDR1sHDd21Q5R8VhqgG5f1soYnSNmIJHvXzjOM/exec)

---

## ⚡ Konfigurasi Vercel Deployment

File `vercel.json` telah dikonfigurasi di root project dan sub-folder frontend untuk memastikan SPA Rewrite berjalan lancar tanpa error 404:

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

---

## 📝 Lisensi
Project ini dibuat untuk sistem manajemen presensi karyawan modern berbasis biometrik wajah dan geofencing GPS.
