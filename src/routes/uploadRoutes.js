// src/routes/uploadRoutes.js
const express = require('express');
const multer = require('multer');
const uploadController = require('../controllers/uploadController');
const { requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Configure multer for memory storage (file buffer)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

/**
 * @route   POST /api/upload
 * @desc    Upload image to Supabase Storage
 * @access  Admin only
 */
router.post(
    '/',
    requireAdmin,
    upload.single('image'), // Expects field name 'image'
    uploadController.uploadImage
);

module.exports = router;
