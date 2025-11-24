// src/middleware/authMiddleware.js
const supabase = require('../config/supabaseClient');

/**
 * Verify Supabase JWT token and extract user info
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

        // Verify token with Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({
                success: false,
                message: 'Token tidak valid atau sudah kadaluarsa'
            });
        }

        // Get user profile from users table
        const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('id, email, full_name, role, avatar_url')
            .eq('id', user.id)
            .single();

        if (profileError) {
            console.error('Profile fetch error:', profileError);
            // Continue with basic user info if profile doesn't exist
            req.user = {
                id: user.id,
                email: user.email,
                role: 'user'
            };
        } else {
            req.user = {
                id: user.id,
                email: user.email || profile.email,
                full_name: profile.full_name,
                role: profile.role || 'user',
                avatar_url: profile.avatar_url
            };
        }

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
