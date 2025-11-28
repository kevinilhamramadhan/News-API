// src/controllers/authController.js
const authModel = require('../models/authModel');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

/**
 * Auth Controller
 * Handles authentication-related requests
 */
const authController = {
    /**
     * Register new user
     * POST /api/auth/register
     */
    async register(req, res, next) {
        try {
            const { email, password, full_name } = req.body;

            // Validation
            if (!email || !password || !full_name) {
                return res.status(400).json({
                    success: false,
                    message: 'Email, password, dan nama lengkap wajib diisi'
                });
            }

            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'Password minimal 6 karakter'
                });
            }

            // Register user
            const { user, profile } = await authModel.register(email, password, full_name);

            // Generate JWT token
            const token = jwt.sign(
                {
                    userId: user.id,
                    email: user.email,
                    role: profile.role
                },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            res.status(201).json({
                success: true,
                message: 'Registrasi berhasil',
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        full_name: profile.full_name,
                        role: profile.role
                    },
                    token
                }
            });
        } catch (error) {
            console.error('Register error:', error);

            if (error.message?.includes('already registered')) {
                return res.status(400).json({
                    success: false,
                    message: 'Email sudah terdaftar'
                });
            }

            next(error);
        }
    },

    /**
     * Login user
     * POST /api/auth/login
     */
    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            // Validation
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email dan password wajib diisi'
                });
            }

            // Login
            const { user, profile } = await authModel.login(email, password);

            // Generate JWT token
            const token = jwt.sign(
                {
                    userId: user.id,
                    email: user.email,
                    role: profile.role
                },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            res.json({
                success: true,
                message: 'Login berhasil',
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        full_name: profile.full_name,
                        avatar_url: profile.avatar_url,
                        role: profile.role
                    },
                    token
                }
            });
        } catch (error) {
            console.error('Login error:', error);

            if (error.message?.includes('Invalid login credentials')) {
                return res.status(401).json({
                    success: false,
                    message: 'Email atau password salah'
                });
            }

            next(error);
        }
    },

    /**
     * Get current user
     * GET /api/auth/me
     */
    async getMe(req, res, next) {
        try {
            // req.userId dari authMiddleware
            const userId = req.userId;

            const user = await authModel.getUserById(userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User tidak ditemukan'
                });
            }

            res.json({
                success: true,
                data: {
                    id: user.id,
                    email: user.email,
                    full_name: user.full_name,
                    avatar_url: user.avatar_url,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Get me error:', error);
            next(error);
        }
    },

    /**
     * Update user profile
     * PUT /api/auth/profile
     */
    async updateProfile(req, res, next) {
        try {
            const userId = req.userId;
            const { full_name, avatar_url } = req.body;

            const updates = {};
            if (full_name) updates.full_name = full_name;
            if (avatar_url) updates.avatar_url = avatar_url;

            if (Object.keys(updates).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Tidak ada data yang diupdate'
                });
            }

            const updatedUser = await authModel.updateProfile(userId, updates);

            res.json({
                success: true,
                message: 'Profil berhasil diupdate',
                data: {
                    id: updatedUser.id,
                    email: updatedUser.email,
                    full_name: updatedUser.full_name,
                    avatar_url: updatedUser.avatar_url,
                    role: updatedUser.role
                }
            });
        } catch (error) {
            console.error('Update profile error:', error);
            next(error);
        }
    },

    /**
     * Logout (token invalidation handled by frontend)
     * POST /api/auth/logout
     */
    logout(req, res) {
        res.json({
            success: true,
            message: 'Logout berhasil'
        });
    }
};

module.exports = authController;
