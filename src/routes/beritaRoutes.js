// src/routes/beritaRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllBerita,
  getBeritaById,
  getBeritaBySlug,
  getBeritaByKategori,
  getBeritaPopuler,
  createBerita,
  updateBerita,
  deleteBerita
} = require('../controllers/beritaController');
const { requireAdmin } = require('../middleware/authMiddleware');

// Public routes (GET - anyone can read)
router.get('/', getAllBerita);
router.get('/populer', getBeritaPopuler);
router.get('/kategori/:kategoriId', getBeritaByKategori);
router.get('/:id', getBeritaById);
router.get('/slug/:slug', getBeritaBySlug);

// Protected routes (POST, PUT, DELETE - admin only)
router.post('/', requireAdmin, createBerita);
router.put('/:id', requireAdmin, updateBerita);
router.delete('/:id', requireAdmin, deleteBerita);

module.exports = router;