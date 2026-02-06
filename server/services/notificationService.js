const Notification = require('../models/Notification');
const { getIO } = require('../config/socket');

// Create and emit notification
exports.createNotification = async (notificationData) => {
  try {
    const notification = await Notification.create(notificationData);
    
    // Populate sender and request details
    await notification.populate('sender', 'name email');
    await notification.populate('request');
    
    // Emit notification via Socket.io
    try {
      const io = getIO();
      io.to(notification.recipient.toString()).emit('notification', notification);
    } catch (socketError) {
      console.log('Socket emission failed:', socketError.message);
    }
    
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Send approval needed notification
exports.sendApprovalNeededNotification = async (request, recipientId, senderRole) => {
  const message = `New ${request.requestType} request from ${senderRole} needs your approval`;
  
  return await this.createNotification({
    recipient: recipientId,
    sender: request.employee,
    request: request._id,
    type: 'approval_needed',
    message
  });
};

// Send approval notification
exports.sendApprovalNotification = async (request, approverId, approverRole) => {
  const message = `Your ${request.requestType} request has been approved by ${approverRole}`;
  
  return await this.createNotification({
    recipient: request.employee,
    sender: approverId,
    request: request._id,
    type: 'request_approved',
    message
  });
};

// Send rejection notification
exports.sendRejectionNotification = async (request, rejecterId, rejecterRole, reason) => {
  const message = `Your ${request.requestType} request has been rejected by ${rejecterRole}${reason ? ': ' + reason : ''}`;
  
  return await this.createNotification({
    recipient: request.employee,
    sender: rejecterId,
    request: request._id,
    type: 'request_rejected',
    message
  });
};
