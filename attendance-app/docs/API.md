# Absensi Karyawan Berbasis Face Recognition - API Documentation

Dokumentasi REST API untuk aplikasi Absensi Karyawan berbasis Face Recognition dengan backend Node.js (Express) dan Google Apps Script REST API.

---

## Base URLs
- **Backend Express Server**: `http://localhost:5000/api`
- **Google Apps Script REST API**: `https://script.google.com/macros/s/AKfycbzOHaNtWI6vARI8aMnkoJh6oC06AzDR1sHDd21Q5R8VhqgG5f1soYnSNmIJHvXzjOM/exec`

---

## Authentication
Aplikasi menggunakan **JSON Web Token (JWT)**. Setiap request ke endpoint terproteksi memerlukan header Authorization:
```http
Authorization: Bearer <your_jwt_token>
```

---

## 1. Authentication Endpoints

### `POST /api/auth/login` (atau `POST Google Apps Script ?action=login`)
Melakukan verifikasi kredensial user (Admin atau Karyawan).

**Request Body:**
```json
{
  "email": "karyawan@company.com",
  "password": "userpassword123"
}
```

**Response Success (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "USR-1001",
    "name": "Alex Vance",
    "nik": "317100234120",
    "email": "karyawan@company.com",
    "divisi": "Engineering",
    "role": "karyawan"
  }
}
```

---

### `POST /api/auth/register` (atau `POST Google Apps Script ?action=register`)
Registrasi user baru beserta penyimpanan minimal 5 sampel vector embedding wajah.

**Request Body:**
```json
{
  "nama": "Budi Santoso",
  "nik": "317109876543",
  "email": "budi@company.com",
  "password": "hashed_password",
  "faceEmbedding": [0.045, -0.12, 0.88, 0.43, -0.09],
  "divisi": "Logistics",
  "role": "karyawan"
}
```

---

## 2. Attendance Endpoints

### `POST /api/attendance/checkin` (atau `POST Google Apps Script ?action=checkin`)
Melakukan presensi masuk (Check-In) dengan validasi kemiripan wajah (similarity >= 90%), Liveness check, GPS Accuracy (<30m), dan Haversine radius validation.

**Request Body:**
```json
{
  "userId": "USR-1001",
  "nama": "Alex Vance",
  "nik": "317100234120",
  "divisi": "Engineering",
  "latitude": -6.2088,
  "longitude": 106.8456,
  "accuracy": 12.5,
  "faceSimilarity": 0.965,
  "selfieUrl": "data:image/png;base64,...",
  "deviceInfo": "Android 14 - Chrome 124.0",
  "checkType": "IN"
}
```

**Response Success (200 OK):**
```json
{
  "success": true,
  "message": "Absensi masuk berhasil dicatat",
  "data": {
    "attendanceId": "ATT-20260728-8921",
    "checkTime": "08:14:22",
    "distanceMeters": 32.4,
    "status": "Present",
    "withinRadius": true
  }
}
```

---

### `POST /api/attendance/checkout` (atau `POST Google Apps Script ?action=checkout`)
Melakukan presensi keluar (Check-Out).

---

### `GET /api/attendance` (atau `GET Google Apps Script ?action=getAttendance`)
Mengambil seluruh data absensi (Admin) atau riwayat absensi pribadi (Karyawan).

**Query Parameters:**
- `userId` (opsional): Filter per ID user
- `tanggal` (opsional): Filter per tanggal (`YYYY-MM-DD`)
- `divisi` (opsional): Filter per divisi
- `status` (opsional): `Present`, `Late`, `On Field`, `Remote`

---

## 3. Settings & Radius Endpoints

### `GET /api/settings` (atau `GET Google Apps Script ?action=getSettings`)
Mengambil konfigurasi lokasi kantor dan radius presensi aktif.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "officeLat": -6.2088,
    "officeLng": 106.8456,
    "radius": 100,
    "accuracyThreshold": 30
  }
}
```

---

### `POST /api/settings/update` (atau `POST Google Apps Script ?action=update-settings`)
Mengubah radius dan titik pusat koordinat kantor (Admin Only).

**Request Body:**
```json
{
  "officeLat": -6.2088,
  "officeLng": 106.8456,
  "radius": 150
}
```
