// src/middleware/authMiddleware.js
const supabase = require('../config/supabaseClient');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Verify JWT token and extract user info
 */
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Token tidak ditemukan. Gunakan format: Authorization: Bearer <token>'
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify JWT token
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (jwtError) {
            return res.status(401).json({
                success: false,
                message: 'Token tidak valid atau sudah kadaluarsa'
            });
        }

        // Extract userId from decoded token
        const userId = decoded.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Token tidak valid'
            });
        }

        // Get user profile from users table
        const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('id, email, full_name, role, avatar_url')
            .eq('id', userId)
            .single();

        if (profileError || !profile) {
            return res.status(401).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }

        // Attach user info to request
        req.user = {
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name,
            role: profile.role || 'user',
            avatar_url: profile.avatar_url
        };
        req.userId = profile.id; // For backward compatibility

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat verifikasi token',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Require authenticated user (any role)
 */
const requireAuth = async (req, res, next) => {
    await verifyToken(req, res, next);
};

/**
 * Require admin role
 */
const requireAdmin = async (req, res, next) => {
    await verifyToken(req, res, () => {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            return res.status(403).json({
                success: false,
                message: 'Akses ditolak. Hanya admin yang dapat melakukan operasi ini.'
            });
        }
    });
};

module.exports = {
    verifyToken,
    requireAuth,
    requireAdmin
};
