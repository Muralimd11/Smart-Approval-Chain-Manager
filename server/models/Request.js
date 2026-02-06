const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  requestType: {
    type: String,
    enum: ['purchase', 'expense', 'leave'],
    required: true
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved_by_teamlead', 'approved', 'rejected'],
    default: 'pending'
  },
  
  // Purchase Request Fields
  purchaseDetails: {
    productName: String,
    marketPrice: Number,
    reason: String,
    documentUrl: String
  },
  
  // Expense Reimbursement Fields
  expenseDetails: {
    amount: Number,
    receiptUrl: String,
    description: String
  },
  
  // Leave Request Fields
  leaveDetails: {
    fromDate: Date,
    toDate: Date,
    reason: String,
    numberOfDays: Number
  },
  
  // Approval tracking
  teamLeadApproval: {
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: Date,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected']
    },
    comment: String
  },
  
  managerApproval: {
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: Date,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected']
    },
    comment: String
  },
  
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectionReason: String,
  rejectedAt: Date,
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
requestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Request', requestSchema);
