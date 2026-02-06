const mongoose = require('mongoose');

const approvalLogSchema = new mongoose.Schema({
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
    required: true
  },
  approver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    enum: ['approved', 'rejected'],
    required: true
  },
  role: {
    type: String,
    enum: ['teamlead', 'manager'],
    required: true
  },
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ApprovalLog', approvalLogSchema);
