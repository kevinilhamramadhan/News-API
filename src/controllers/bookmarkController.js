// src/controllers/bookmarkController.js
const bookmarkModel = require('../models/bookmarkModel');

/**
 * Bookmark Controller
 * Handles bookmark-related requests
 */
const bookmarkController = {
    /**
     * Get user's bookmarks
     * GET /api/bookmarks
     */
    async getUserBookmarks(req, res, next) {
        try {
            const userId = req.userId; // From auth middleware

            const bookmarks = await bookmarkModel.getUserBookmarks(userId);

            res.json({
                success: true,
                data: bookmarks,
                message: 'Bookmarks berhasil diambil'
            });
        } catch (error) {
            console.error('Get bookmarks error:', error);
            next(error);
        }
    },

    /**
     * Add bookmark
     * POST /api/bookmarks/:beritaId
     */
    async addBookmark(req, res, next) {
        try {
            const userId = req.userId;
            const { beritaId } = req.params;

            if (!beritaId) {
                return res.status(400).json({
                    success: false,
                    message: 'Berita ID wajib diisi'
                });
            }

            const result = await bookmarkModel.addBookmark(userId, beritaId);

            res.status(201).json({
                success: true,
                ...result
            });
        } catch (error) {
            console.error('Add bookmark error:', error);
            next(error);
        }
    },

    /**
     * Remove bookmark
     * DELETE /api/bookmarks/:beritaId
     */
    async removeBookmark(req, res, next) {
        try {
            const userId = req.userId;
            const { beritaId } = req.params;

            if (!beritaId) {
                return res.status(400).json({
                    success: false,
                    message: 'Berita ID wajib diisi'
                });
            }

            const result = await bookmarkModel.removeBookmark(userId, beritaId);

            res.json({
                success: true,
                ...result
            });
        } catch (error) {
            console.error('Remove bookmark error:', error);
            next(error);
        }
    },

    /**
     * Check if berita is bookmarked
     * GET /api/bookmarks/check/:beritaId
     */
    async checkBookmark(req, res, next) {
        try {
            const userId = req.userId;
            const { beritaId } = req.params;

            if (!beritaId) {
                return res.status(400).json({
                    success: false,
                    message: 'Berita ID wajib diisi'
                });
            }

            const isBookmarked = await bookmarkModel.isBookmarked(userId, beritaId);

            res.json({
                success: true,
                data: { isBookmarked }
            });
        } catch (error) {
            console.error('Check bookmark error:', error);
            next(error);
        }
    }
};

module.exports = bookmarkController;
