const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'lumina_face_track_super_secret_jwt_2026';

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        // Fallback for development demo mode if no token provided
        req.user = { id: 'USR-1001', name: 'Alex Vance', role: 'admin' };
        return next();
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ success: false, message: 'Invalid or expired token' });
        req.user = user;
        next();
    });
}

function requireAdmin(req, res, next) {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'Admin')) {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Akses ditolak: Hanya Admin yang diizinkan' });
    }
}

module.exports = {
    authenticateToken,
    requireAdmin,
    JWT_SECRET
};
