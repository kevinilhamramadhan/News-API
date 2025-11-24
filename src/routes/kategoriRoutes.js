// src/routes/kategoriRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllKategori,
  getKategoriById,
  getKategoriBySlug,
  createKategori,
  updateKategori,
  deleteKategori
} = require('../controllers/kategoriController');
const { requireAdmin } = require('../middleware/authMiddleware');

// Public routes (GET - anyone can read)
router.get('/', getAllKategori);
router.get('/:id', getKategoriById);
router.get('/slug/:slug', getKategoriBySlug);

// Protected routes (POST, PUT, DELETE - admin only)
router.post('/', requireAdmin, createKategori);
router.put('/:id', requireAdmin, updateKategori);
router.delete('/:id', requireAdmin, deleteKategori);

module.exports = router;