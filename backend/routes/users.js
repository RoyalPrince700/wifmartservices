// backend/routes/users.js
const express = require('express');
const { updateProfile, getUser } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const router = express.Router();

router.put('/profile', protect, upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'cacDocument', maxCount: 1 }
]), updateProfile);

router.get('/:id', getUser);

module.exports = router;