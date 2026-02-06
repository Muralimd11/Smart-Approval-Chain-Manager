module.exports = {
  REQUEST_TYPES: {
    PURCHASE: 'purchase',
    EXPENSE: 'expense',
    LEAVE: 'leave'
  },
  
  REQUEST_STATUS: {
    PENDING: 'pending',
    APPROVED_BY_TEAMLEAD: 'approved_by_teamlead',
    APPROVED: 'approved',
    REJECTED: 'rejected'
  },
  
  USER_ROLES: {
    EMPLOYEE: 'employee',
    TEAMLEAD: 'teamlead',
    MANAGER: 'manager'
  },
  
  APPROVAL_STATUS: {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
  },
  
  NOTIFICATION_TYPES: {
    REQUEST_SUBMITTED: 'request_submitted',
    REQUEST_APPROVED: 'request_approved',
    REQUEST_REJECTED: 'request_rejected',
    APPROVAL_NEEDED: 'approval_needed'
  }
};
