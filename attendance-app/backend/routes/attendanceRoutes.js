const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { calculateHaversineDistance, isGPSAccuracyValid } = require('../utils/haversine');
const { postToAppsScript, fetchSheetCSV, GIDS } = require('../services/googleSheetService');

// POST /api/attendance/checkin
router.post('/checkin', authenticateToken, async (req, res) => {
    try {
        const { latitude, longitude, accuracy, faceSimilarity, selfieUrl, checkType, officeLat, officeLng, maxRadius } = req.body;

        // GPS Accuracy check (< 30m)
        if (accuracy && !isGPSAccuracyValid(accuracy)) {
            return res.status(400).json({
                success: false,
                message: `❌ Akurasi GPS buruk (${accuracy}m). Wajib < 30 meter.`
            });
        }

        // Face Similarity Threshold Check (>= 90%)
        const similarity = parseFloat(faceSimilarity) || 0.95;
        if (similarity < 0.90) {
            return res.status(400).json({
                success: false,
                message: `❌ Wajah tidak dikenali! Score kemiripan: ${(similarity * 100).toFixed(1)}% (Minimal 90%)`
            });
        }

        // Haversine Radius Check
        const targetLat = officeLat !== undefined ? parseFloat(officeLat) : -6.2088;
        const targetLng = officeLng !== undefined ? parseFloat(officeLng) : 106.8456;
        const allowedRadius = maxRadius !== undefined ? parseFloat(maxRadius) : 100;

        const distance = calculateHaversineDistance(latitude, longitude, targetLat, targetLng);

        if (distance > allowedRadius) {
            return res.status(400).json({
                success: false,
                message: `❌ Anda berada di luar area absensi. Jarak: ${distance}m (Maksimal: ${allowedRadius}m)`,
                distance,
                allowedRadius
            });
        }

        // Prepare Apps Script Post Payload
        const payload = {
            action: 'checkin',
            userId: req.user.id || 'USR-8026',
            nama: req.user.name || 'Alex Vance',
            tanggal: new Date().toISOString().slice(0, 10),
            jam: new Date().toLocaleTimeString(),
            checkType: checkType || 'IN',
            latitude,
            longitude,
            distance,
            similarity,
            selfieUrl: selfieUrl || '',
            status: distance <= allowedRadius ? 'Present' : 'Out of Radius'
        };

        const result = await postToAppsScript(payload);

        res.json({
            success: true,
            message: '✅ Absensi berhasil dicatat!',
            data: {
                attendanceId: `ATT-${Date.now()}`,
                distance,
                similarity: `${(similarity * 100).toFixed(1)}%`,
                status: 'Present'
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/attendance
router.get('/', authenticateToken, async (req, res) => {
    try {
        const csvData = await fetchSheetCSV(GIDS.attendance);
        if (!csvData) {
            return res.json({ success: true, data: [] });
        }

        const lines = csvData.trim().split('\n');
        const attendanceList = [];
        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',');
            if (cols.length >= 6) {
                attendanceList.push({
                    id: cols[0],
                    userId: cols[1],
                    nama: cols[2],
                    tanggal: cols[3],
                    jam: cols[4],
                    checkType: cols[5],
                    latitude: parseFloat(cols[6]) || 0,
                    longitude: parseFloat(cols[7]) || 0,
                    distance: parseFloat(cols[8]) || 0,
                    similarity: cols[9] || '98.5%',
                    status: cols[11] || 'Present'
                });
            }
        }

        res.json({ success: true, data: attendanceList });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
