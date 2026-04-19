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

      // Check for overlapping leave requests
      const existingLeave = await Request.findOne({
        employee: req.user.id,
        requestType: 'leave',
        status: { $ne: 'rejected' },
        $or: [
          {
            'leaveDetails.fromDate': { $lte: to },
            'leaveDetails.toDate': { $gte: from }
          }
        ]
      });

      if (existingLeave) {
        return res.status(400).json({
          success: false,
          message: 'You have already applied for leave during these dates'
        });
      }
    }

    // Handle Travel Authorization
    if (requestType === 'travel') {
      const { travelDetails } = req.body;
      let parsedDetails = typeof travelDetails === 'string' ? JSON.parse(travelDetails) : travelDetails;

      if (req.file) {
        const uploadResult = await cloudinaryService.uploadPDF(
          req.file.buffer,
          'travel-documents',
          req.file.originalname
        );
        parsedDetails.documentUrl = uploadResult.url;
      }

      requestData.travelDetails = parsedDetails;
    }

    // Handle WFH Request
    if (requestType === 'wfh') {
      const { wfhDetails } = req.body;
      let parsedDetails = typeof wfhDetails === 'string' ? JSON.parse(wfhDetails) : wfhDetails;
      requestData.wfhDetails = parsedDetails;
    }

    // Handle Training Request
    if (requestType === 'training') {
      const { trainingDetails } = req.body;
      let parsedDetails = typeof trainingDetails === 'string' ? JSON.parse(trainingDetails) : trainingDetails;

      if (req.file) {
        const uploadResult = await cloudinaryService.uploadPDF(
          req.file.buffer,
          'training-brochures',
          req.file.originalname
        );
        parsedDetails.documentUrl = uploadResult.url;
      }

      requestData.trainingDetails = parsedDetails;
    }

    // Handle Shift Change Request
    if (requestType === 'shift') {
      const { shiftDetails } = req.body;
      let parsedDetails = typeof shiftDetails === 'string' ? JSON.parse(shiftDetails) : shiftDetails;

      if (req.file) {
        const uploadResult = await cloudinaryService.uploadPDF(
          req.file.buffer,
          'shift-documents',
          req.file.originalname
        );
        parsedDetails.documentUrl = uploadResult.url;
      }

      requestData.shiftDetails = parsedDetails;
    }

    // Create request
    const request = await Request.create(requestData);
    await request.populate('employee', 'name email department');

    // Find team lead of the employee's department to notify
    const employee = await User.findById(req.user.id);
    const teamLead = await User.findOne({ role: 'teamlead', department: employee.department });

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

    // If Team Lead, show only pending requests for their department
    if (req.user.role === 'teamlead') {
      const teamLead = await User.findById(req.user.id);

      // Find all employees in the same department
      const departmentEmployees = await User.find({
        role: 'employee',
        department: teamLead.department
      }).select('_id');

      const employeeIds = departmentEmployees.map(emp => emp._id);

      console.log(`[DEBUG] TL ${teamLead.name} (Dept: ${teamLead.department}) viewing requests.`);
      console.log(`[DEBUG] Found ${employeeIds.length} employees in ${teamLead.department}: ${employeeIds}`);

      query = {
        employee: { $in: employeeIds },
        status: { $in: ['pending'] },
        'teamLeadApproval.status': 'pending'
      };

      console.log('[DEBUG] Generated Query:', JSON.stringify(query));
    }

    // If Manager, show only requests approved by team lead for their department
    if (req.user.role === 'manager') {
      const manager = await User.findById(req.user.id);

      // Find all employees in the same department
      const departmentEmployees = await User.find({
        role: 'employee',
        department: manager.department
      }).select('_id');

      const employeeIds = departmentEmployees.map(emp => emp._id);

      query = {
        employee: { $in: employeeIds },
        status: { $in: ['approved_by_teamlead'] },
        'managerApproval.status': 'pending'
      };
    }

    console.log(`[DEBUG] getAllRequests: User=${req.user.email}, Role=${req.user.role}`);

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

// @desc    Delete a request
// @route   DELETE /api/requests/:id
// @access  Private (Employee)
exports.deleteRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Ensure user owns the request
    if (request.employee.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this request'
      });
    }

    // Check status allowlist for deletion
    const allowedStatuses = ['pending', 'approved_by_teamlead', 'rejected'];
    if (!allowedStatuses.includes(request.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete request in this status'
      });
    }

    // If approved by team lead, notify them
    if (request.status === 'approved_by_teamlead') {
      const employee = await User.findById(req.user.id);
      const teamLead = await User.findOne({ role: 'teamlead', department: employee.department });

      if (teamLead) {
        // Populate employee name for the notification
        await request.populate('employee', 'name');
        await notificationService.sendRequestDeletedNotification(
          request,
          teamLead._id,
          request.employee.name
        );
      }
    }

    await Request.findByIdAndDelete(req.params.id); // Or request.remove() if using older Mongoose

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
