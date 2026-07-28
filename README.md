# Absensi Karyawan Berbasis Face Recognition & GPS Geofence

![Lumina FaceTrack AI](assets/logo.png)

Aplikasi **Absensi Karyawan Berbasis Face Recognition & GPS Geofence** modern, responsif, dan mudah digunakan berbasis teknologi Web. Sistem ini terintegrasi penuh dengan **Google Sheets** sebagai database utama, **Google Apps Script** sebagai REST API backend, serta **OpenStreetMap & Leaflet.js** untuk penentuan radius geofence lokasi kantor berbasis **Formula Haversine**.

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

## 🛠️ Teknologi yang Digunakan

- **Frontend**: React + Tailwind CSS, HTML5 Canvas, Framer Motion, SweetAlert2, Lucide Icons
- **Backend Server**: Node.js (Express.js), JWT Authentication, bcryptjs, Rate Limiter
- **Peta & GPS**: OpenStreetMap, Leaflet.js, Formula Haversine
- **Database Backend**: Google Sheets API & Google Apps Script (GAS) Web App

---

## 📁 Struktur Project

```
absensi/
│
├── index.html                           # Single Page Application HTML Markup
├── styles.css                           # CSS Design System Dark Mode Glassmorphic
├── app.js                               # Logic Presensi & Sinkronisasi Google Sheets
├── assets/                              # Aset Gambar & Logo Lumina
│
├── attendance-app/                      # Project Full-Stack Modular React + Node.js
│   ├── frontend/                        # Aplikasi React + Tailwind CSS (Vite)
│   │   ├── pages/                       # Login, AdminDashboard, EmployeeDashboard
│   │   ├── components/                  # FaceScanScanner, MapTracker, AttendanceRecords, GeofenceSettings, BonusModules
│   │   └── package.json
│   ├── backend/                         # Express Node.js Backend REST API
│   │   ├── routes/                      # authRoutes, attendanceRoutes, settingsRoutes
│   │   ├── services/                    # googleSheetService
│   │   ├── utils/                       # haversine.js
│   │   └── google-apps-script/
│   │       └── Code.gs                  # REST API Script Google Apps Script
│   └── docs/                            # Dokumentasi API.md, DATABASE.md, DEPLOYMENT.md
│
└── README.md                            # Panduan Project Bahasa Indonesia
```

---

## ⚡ Cara Menjalankan Project

### 1. Menjalankan Server Frontend & Backend:
```bash
# Clone Repository
git clone https://github.com/jefry195/absensi.git
cd absensi

# Menjalankan Backend Express (Port 5000)
cd attendance-app/backend
npm install
npm start

# Menjalankan Frontend React Vite (Port 1234)
cd ../frontend
npm install
npm run dev
```

Akses aplikasi melalui browser: [http://localhost:1234](http://localhost:1234)

---

## 🌐 Tautan Database & Live Deployment
- **Google Sheets Database**: [DB_Absensi_Karyawan](https://docs.google.com/spreadsheets/d/1cJM7tAYKsfeTv7owtIunLIKxmLpSGQ9qqmR18h_Omd4/edit?usp=sharing)
- **Google Apps Script Execution Endpoint**: [GAS Web App](https://script.google.com/macros/s/AKfycbzOHaNtWI6vARI8aMnkoJh6oC06AzDR1sHDd21Q5R8VhqgG5f1soYnSNmIJHvXzjOM/exec)

---

## 📝 Lisensi
Project ini dibuat untuk sistem manajemen presensi karyawan modern berbasis biometrik wajah dan geofencing GPS.
