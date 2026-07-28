const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Import Routes
const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

// API Endpoint Registrations
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/settings', settingsRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'Online',
        service: 'Absensi Karyawan Face Recognition API',
        timestamp: new Date().toISOString(),
        database: 'Google Sheets DB Sync Active'
    });
});

app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`Absensi Backend Express Server Running on Port ${PORT}`);
    console.log(`API Base URL: http://localhost:${PORT}/api`);
    console.log(`====================================================`);
});
