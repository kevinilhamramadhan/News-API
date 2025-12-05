// src/routes/beritaRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllBerita,
  getBeritaById,
  getBeritaBySlug,
  getBeritaByKategori,
  getBeritaPopuler,
  getFeaturedBerita,
  incrementViews,
  createBerita,
  updateBerita,
  deleteBerita
} = require('../controllers/beritaController');
const { requireAdmin } = require('../middleware/authMiddleware');

// Public routes (GET - anyone can read)
// IMPORTANT: Static routes must come before dynamic routes
router.get('/', getAllBerita);
router.get('/populer', getBeritaPopuler);
router.get('/featured', getFeaturedBerita);
router.get('/kategori/:kategoriId', getBeritaByKategori);
router.get('/slug/:slug', getBeritaBySlug);
// Dynamic route - must be last to avoid catching static routes
router.get('/:id', getBeritaById);

// Views increment
router.post('/:id/view', incrementViews);

// Protected routes (POST, PUT, DELETE - admin only)
router.post('/', requireAdmin, createBerita);
router.put('/:id', requireAdmin, updateBerita);
router.delete('/:id', requireAdmin, deleteBerita);

module.exports = router;