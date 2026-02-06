const Request = require('../models/Request');
const ApprovalLog = require('../models/ApprovalLog');
const notificationService = require('../services/notificationService');
const User = require('../models/User');

// @desc    Approve/Reject request by Team Lead
// @route   PUT /api/approvals/teamlead/:id
// @access  Private (Team Lead)
exports.teamLeadApproval = async (req, res) => {
  try {
    const { action, comment } = req.body; // action: 'approve' or 'reject'
    
    const request = await Request.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request has already been processed'
      });
    }

    if (action === 'approve') {
      // Approve by team lead
      request.teamLeadApproval = {
        approvedBy: req.user.id,
        approvedAt: Date.now(),
        status: 'approved',
        comment
      };
      request.status = 'approved_by_teamlead';

      await request.save();

      // Create approval log
      await ApprovalLog.create({
        request: request._id,
        approver: req.user.id,
        action: 'approved',
        role: 'teamlead',
        comment
      });

      // Send notification to employee
      await notificationService.sendApprovalNotification(
        request,
        req.user.id,
        'Team Lead'
      );

      // Notify manager
      const manager = await User.findOne({ role: 'manager' });
      if (manager) {
        await notificationService.sendApprovalNeededNotification(
          request,
          manager._id,
          'Team Lead'
        );
      }

    } else if (action === 'reject') {
      // Reject by team lead
      request.teamLeadApproval = {
        approvedBy: req.user.id,
        approvedAt: Date.now(),
        status: 'rejected',
        comment
      };
      request.status = 'rejected';
      request.rejectedBy = req.user.id;
      request.rejectionReason = comment;
      request.rejectedAt = Date.now();

      await request.save();

      // Create approval log
      await ApprovalLog.create({
        request: request._id,
        approver: req.user.id,
        action: 'rejected',
        role: 'teamlead',
        comment
      });

      // Send rejection notification to employee
      await notificationService.sendRejectionNotification(
        request,
        req.user.id,
        'Team Lead',
        comment
      );
    }

    await request.populate('employee', 'name email');
    await request.populate('teamLeadApproval.approvedBy', 'name email');

    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Approve/Reject request by Manager
// @route   PUT /api/approvals/manager/:id
// @access  Private (Manager)
exports.managerApproval = async (req, res) => {
  try {
    const { action, comment } = req.body;
    
    const request = await Request.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (request.status !== 'approved_by_teamlead') {
      return res.status(400).json({
        success: false,
        message: 'Request must be approved by Team Lead first'
      });
    }

    if (action === 'approve') {
      // Final approval by manager
      request.managerApproval = {
        approvedBy: req.user.id,
        approvedAt: Date.now(),
        status: 'approved',
        comment
      };
      request.status = 'approved';

      await request.save();

      // Create approval log
      await ApprovalLog.create({
        request: request._id,
        approver: req.user.id,
        action: 'approved',
        role: 'manager',
        comment
      });

      // Send final approval notification to employee
      await notificationService.sendApprovalNotification(
        request,
        req.user.id,
        'Manager'
      );

    } else if (action === 'reject') {
      // Reject by manager
      request.managerApproval = {
        approvedBy: req.user.id,
        approvedAt: Date.now(),
        status: 'rejected',
        comment
      };
      request.status = 'rejected';
      request.rejectedBy = req.user.id;
      request.rejectionReason = comment;
      request.rejectedAt = Date.now();

      await request.save();

      // Create approval log
      await ApprovalLog.create({
        request: request._id,
        approver: req.user.id,
        action: 'rejected',
        role: 'manager',
        comment
      });

      // Send rejection notification to employee
      await notificationService.sendRejectionNotification(
        request,
        req.user.id,
        'Manager',
        comment
      );
    }

    await request.populate('employee', 'name email');
    await request.populate('teamLeadApproval.approvedBy', 'name email');
    await request.populate('managerApproval.approvedBy', 'name email');

    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get approval history for a request
// @route   GET /api/approvals/history/:id
// @access  Private
exports.getApprovalHistory = async (req, res) => {
  try {
    const logs = await ApprovalLog.find({ request: req.params.id })
      .populate('approver', 'name email role')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
