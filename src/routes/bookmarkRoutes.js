// src/routes/bookmarkRoutes.js
const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmarkController');
const { requireAuth } = require('../middleware/authMiddleware');

// All bookmark routes require authentication
router.use(requireAuth);

router.get('/', bookmarkController.getUserBookmarks);
router.post('/:beritaId', bookmarkController.addBookmark);
router.delete('/:beritaId', bookmarkController.removeBookmark);
router.get('/check/:beritaId', bookmarkController.checkBookmark);

module.exports = router;
