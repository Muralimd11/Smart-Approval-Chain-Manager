const Request = require('../models/Request');
const User = require('../models/User');
const cloudinaryService = require('../services/cloudinaryService');
const notificationService = require('../services/notificationService');

// @desc    Create a new request
// @route   POST /api/requests
// @access  Private (Employee)
exports.createRequest = async (req, res) => {
  try {
    const { requestType } = req.body;
    let requestData = {
      requestType,
      employee: req.user.id,
      status: 'pending',
      teamLeadApproval: { status: 'pending' },
      managerApproval: { status: 'pending' }
    };

    // Handle Purchase Request
    if (requestType === 'purchase') {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload a PDF document'
        });
      }

      const { productName, marketPrice, reason } = req.body;

      // Upload to Cloudinary (or local)
      const uploadResult = await cloudinaryService.uploadPDF(
        req.file.buffer,
        'purchase-requests',
        req.file.originalname
      );

      requestData.purchaseDetails = {
        productName,
        marketPrice,
        reason,
        documentUrl: uploadResult.url
      };
    }

    // Handle Expense Reimbursement
    if (requestType === 'expense') {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload a receipt'
        });
      }

      const { amount, description } = req.body;

      // Upload to Cloudinary (or local)
      const uploadResult = await cloudinaryService.uploadPDF(
        req.file.buffer,
        'expense-receipts',
        req.file.originalname
      );

      requestData.expenseDetails = {
        amount,
        description,
        receiptUrl: uploadResult.url
      };
    }

    // Handle Leave Request
    if (requestType === 'leave') {
      const { fromDate, toDate, reason } = req.body;

      const from = new Date(fromDate);
      const to = new Date(toDate);
      const numberOfDays = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;

      requestData.leaveDetails = {
        fromDate: from,
        toDate: to,
        reason,
        numberOfDays
      };
    }

    // Create request
    const request = await Request.create(requestData);
    await request.populate('employee', 'name email department');

    // Find team lead to notify
    const teamLead = await User.findOne({ role: 'teamlead' });
    if (teamLead) {
      await notificationService.sendApprovalNeededNotification(
        request,
        teamLead._id,
        'employee'
      );
    }

    res.status(201).json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all requests for employee
// @route   GET /api/requests/my-requests
// @access  Private (Employee)
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ employee: req.user.id })
      .populate('employee', 'name email')
      .populate('teamLeadApproval.approvedBy', 'name email')
      .populate('managerApproval.approvedBy', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single request
// @route   GET /api/requests/:id
// @access  Private
exports.getRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('employee', 'name email department')
      .populate('teamLeadApproval.approvedBy', 'name email')
      .populate('managerApproval.approvedBy', 'name email')
      .populate('rejectedBy', 'name email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

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

// @desc    Get all requests (for Team Lead and Manager)
// @route   GET /api/requests
// @access  Private (Team Lead, Manager)
exports.getAllRequests = async (req, res) => {
  try {
    let query = {};

    // If Team Lead, show only pending requests for team lead approval
    if (req.user.role === 'teamlead') {
      query = {
        status: { $in: ['pending'] },
        'teamLeadApproval.status': 'pending'
      };
    }

    // If Manager, show only requests approved by team lead
    if (req.user.role === 'manager') {
      query = {
        status: { $in: ['approved_by_teamlead'] },
        'managerApproval.status': 'pending'
      };
    }

    const requests = await Request.find(query)
      .populate('employee', 'name email department')
      .populate('teamLeadApproval.approvedBy', 'name email')
      .populate('managerApproval.approvedBy', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
