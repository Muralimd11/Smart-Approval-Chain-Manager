const express = require('express');
const { register, login, getMe, getAllUsers } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/users', protect, getAllUsers);
router.put('/signature-pin', protect, exports.updateSignaturePin || require('../controllers/authController').updateSignaturePin);

module.exports = router;
