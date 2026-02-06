export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

export const REQUEST_TYPES = {
  PURCHASE: 'purchase',
  EXPENSE: 'expense',
  LEAVE: 'leave'
};

export const REQUEST_STATUS = {
  PENDING: 'pending',
  APPROVED_BY_TEAMLEAD: 'approved_by_teamlead',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

export const USER_ROLES = {
  EMPLOYEE: 'employee',
  TEAMLEAD: 'teamlead',
  MANAGER: 'manager'
};

export const REQUEST_TYPE_LABELS = {
  purchase: 'Purchase Request',
  expense: 'Expense Reimbursement',
  leave: 'Leave Request'
};

export const STATUS_LABELS = {
  pending: 'Pending',
  approved_by_teamlead: 'Approved by Team Lead',
  approved: 'Approved',
  rejected: 'Rejected'
};

export const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved_by_teamlead: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
};
