const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { postToAppsScript, fetchSheetCSV, GIDS } = require('../services/googleSheetService');

// GET /api/settings
router.get('/', async (req, res) => {
    try {
        const csvData = await fetchSheetCSV(GIDS.settings);
        if (csvData) {
            const lines = csvData.trim().split('\n');
            if (lines.length > 1) {
                const cols = lines[1].split(',');
                return res.json({
                    success: true,
                    data: {
                        officeLat: parseFloat(cols[0]) || -6.2088,
                        officeLng: parseFloat(cols[1]) || 106.8456,
                        radius: parseInt(cols[2]) || 100
                    }
                });
            }
        }
        res.json({
            success: true,
            data: { officeLat: -6.2088, officeLng: 106.8456, radius: 100 }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/settings/update
router.post('/update', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { officeLat, officeLng, radius } = req.body;
        if (!officeLat || !officeLng || !radius) {
            return res.status(400).json({ success: false, message: 'officeLat, officeLng, dan radius wajib diisi' });
        }

        const payload = {
            action: 'update-settings',
            officeLat: parseFloat(officeLat),
            officeLng: parseFloat(officeLng),
            radius: parseInt(radius)
        };

        const result = await postToAppsScript(payload);
        res.json({
            success: true,
            message: `Radius berhasil diperbarui menjadi ${radius} meter!`,
            data: payload
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
