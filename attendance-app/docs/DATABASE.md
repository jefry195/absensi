# Absensi Karyawan Berbasis Face Recognition - Database Schema

Dokumentasi skema database **Google Sheets** yang digunakan sebagai primary database sistem presensi.

---

## 📊 Google Sheets Structure (`DB_Absensi_Karyawan`)
- **Spreadsheet ID**: `1cJM7tAYKsfeTv7owtIunLIKxmLpSGQ9qqmR18h_Omd4`
- **Spreadsheet URL**: [DB_Absensi_Karyawan](https://docs.google.com/spreadsheets/d/1cJM7tAYKsfeTv7owtIunLIKxmLpSGQ9qqmR18h_Omd4/edit?usp=sharing)

---

## 1. Sheet: `Users` (GID: `0`)
Menyimpan data master karyawan, kredensial login terenkripsi, dan nilai vektor face embedding.

| Column Header | Data Type | Example Value | Description |
| :--- | :--- | :--- | :--- |
| **ID** | String (PK) | `USR-1001` | Unique User Identifier |
| **Nama** | String | `Alex Vance` | Nama Lengkap Karyawan |
| **NIK** | String | `317100234120` | Nomor Induk Karyawan |
| **Email** | String (Unique) | `alex.vance@company.com` | Email Login Karyawan |
| **Password** | String (Hashed) | `$2b$10$e8w.x9Z...` | Password bcrypt hash |
| **FaceEmbedding**| String (JSON Array) | `[0.045, -0.120, 0.881, ...]` | Vector Embedding Wajah 128D/512D |
| **Divisi** | String | `Engineering` | Divisi Kerja |
| **Role** | String | `admin` / `karyawan` | Role Hak Akses Sistem |

---

## 2. Sheet: `Attendance` (GID: `1528320542`)
Menyimpan setiap transaksi log presensi (Check-In dan Check-Out).

| Column Header | Data Type | Example Value | Description |
| :--- | :--- | :--- | :--- |
| **ID** | String (PK) | `ATT-20260728-001` | Unique Attendance Record ID |
| **UserID** | String (FK) | `USR-1001` | Reference ke Sheet Users |
| **Nama** | String | `Alex Vance` | Nama Karyawan |
| **Tanggal** | Date (`YYYY-MM-DD`)| `2026-07-28` | Tanggal Presensi |
| **Jam** | Time (`HH:mm:ss`) | `08:14:22` | Waktu Presensi |
| **CheckType** | String | `IN` / `OUT` | Tipe Presensi (Masuk/Keluar) |
| **Latitude** | Float | `-6.208800` | GPS Latitude Posisi User |
| **Longitude** | Float | `106.845600` | GPS Longitude Posisi User |
| **Distance** | Float (Meters) | `24.5` | Jarak dari Kantor (Haversine) |
| **Similarity** | Float (0.0 - 1.0)| `0.985` | Score Kemiripan Wajah Face ID |
| **SelfieURL** | String (Data URI) | `data:image/jpeg;base64,...` | Tangkapan Foto Selfie Verification |
| **Status** | String | `Present` / `Late` / `On Field` | Status Presensi |

---

## 3. Sheet: `Settings` (GID: `775821409`)
Menyimpan konfigurasi parameter lokasi dan radius presensi kantor.

| Column Header | Data Type | Example Value | Description |
| :--- | :--- | :--- | :--- |
| **OfficeLatitude** | Float | `-6.208800` | GPS Latitude Titik Pusat Kantor |
| **OfficeLongitude**| Float | `106.845600` | GPS Longitude Titik Pusat Kantor |
| **Radius** | Integer (Meters)| `100` | Radius Presensi Maksimal (50m - 1000m) |
