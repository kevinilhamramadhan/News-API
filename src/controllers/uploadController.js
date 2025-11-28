// src/controllers/uploadController.js
const supabase = require('../config/supabaseClient');

/**
 * Upload Controller
 * Handles file uploads to Supabase Storage
 */
const uploadController = {
    /**
     * Upload image to Supabase Storage
     * POST /api/upload
     */
    async uploadImage(req, res, next) {
        try {
            // Check if file exists in request
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded'
                });
            }

            const file = req.file;
            const bucket = req.body.bucket || 'berita-images';

            // Validate file type (images only)
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.mimetype)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid file type. Only images are allowed (JPEG, PNG, GIF, WebP)'
                });
            }

            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (file.size > maxSize) {
                return res.status(400).json({
                    success: false,
                    message: 'File too large. Maximum size is 5MB'
                });
            }

            // Generate unique filename
            const fileExt = file.originalname.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = fileName;

            console.log('[uploadImage] Uploading file:', { fileName, size: file.size, type: file.mimetype });

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file.buffer, {
                    contentType: file.mimetype,
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.error('[uploadImage] Upload error:', uploadError);
                throw uploadError;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            console.log('[uploadImage] Upload successful:', publicUrl);

            res.status(201).json({
                success: true,
                data: {
                    url: publicUrl,
                    fileName: fileName
                },
                message: 'File uploaded successfully'
            });
        } catch (error) {
            console.error('Upload error:', error);

            // Provide helpful error messages
            if (error.message?.includes('Bucket not found')) {
                return res.status(500).json({
                    success: false,
                    message: 'Storage bucket not found. Please create "berita-images" bucket in Supabase Storage'
                });
            }

            next(error);
        }
    }
};

module.exports = uploadController;
