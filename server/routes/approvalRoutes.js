const express = require('express');
const {
  teamLeadApproval,
  managerApproval,
  getApprovalHistory
} = require('../controllers/approvalController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.put('/teamlead/:id', protect, authorize('teamlead'), teamLeadApproval);
router.put('/manager/:id', protect, authorize('manager'), managerApproval);
router.get('/history/:id', protect, getApprovalHistory);

module.exports = router;
