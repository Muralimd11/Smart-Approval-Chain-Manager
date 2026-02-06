const express = require('express');
const {
  createRequest,
  getMyRequests,
  getRequest,
  getAllRequests
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router
  .route('/')
  .post(protect, authorize('employee'), upload.single('file'), createRequest)
  .get(protect, authorize('teamlead', 'manager'), getAllRequests);

router.get('/my-requests', protect, authorize('employee'), getMyRequests);
router.get('/:id', protect, getRequest);

module.exports = router;
