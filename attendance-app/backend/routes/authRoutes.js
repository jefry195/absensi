const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../middleware/auth');
const { postToAppsScript, fetchSheetCSV, GIDS } = require('../services/googleSheetService');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email dan password wajib diisi' });
        }

        // Demo Admin & Karyawan Fallback for instant login
        if (email === 'admin@lumina.ai' || email === 'admin@company.com') {
            const token = jwt.sign({ id: 'USR-8026', name: 'Alex Vance', role: 'admin', email }, JWT_SECRET, { expiresIn: '24h' });
            return res.json({
                success: true,
                token,
                user: { id: 'USR-8026', name: 'Alex Vance', nik: '317100234120', email, divisi: 'Executive', role: 'admin' }
            });
        }

        if (email === 'karyawan@company.com' || email === 'user@company.com') {
            const token = jwt.sign({ id: 'USR-4102', name: 'Sophia Chen', role: 'karyawan', email }, JWT_SECRET, { expiresIn: '24h' });
            return res.json({
                success: true,
                token,
                user: { id: 'USR-4102', name: 'Sophia Chen', nik: '317100234990', email, divisi: 'Design', role: 'karyawan' }
            });
        }

        // Attempt Apps Script Login
        const appsScriptRes = await postToAppsScript({ action: 'login', email, password });
        if (appsScriptRes && appsScriptRes.success) {
            const token = jwt.sign(appsScriptRes.user, JWT_SECRET, { expiresIn: '24h' });
            return res.json({ success: true, token, user: appsScriptRes.user });
        }

        return res.status(401).json({ success: false, message: 'Email atau password tidak ditemukan' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { nama, nik, email, password, faceEmbedding, divisi, role } = req.body;
        if (!nama || !email || !faceEmbedding) {
            return res.status(400).json({ success: false, message: 'Data registrasi & Face Embedding tidak lengkap (min 5 foto)' });
        }

        const hashedPassword = password ? await bcrypt.hash(password, 10) : '';
        const payload = {
            action: 'register',
            nama,
            nik: nik || `NIK-${Math.floor(Math.random() * 899999 + 100000)}`,
            email,
            password: hashedPassword,
            faceEmbedding,
            divisi: divisi || 'General',
            role: role || 'karyawan'
        };

        const result = await postToAppsScript(payload);
        res.json({ success: true, message: 'User berhasil didaftarkan dengan face embedding', result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
