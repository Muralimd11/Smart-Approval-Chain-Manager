import api from './api';

export const approvalService = {
  teamLeadApproval: async (requestId, action, comment) => {
    const response = await api.put(`/approvals/teamlead/${requestId}`, {
      action,
      comment
    });
    return response.data;
  },

  managerApproval: async (requestId, action, comment) => {
    const response = await api.put(`/approvals/manager/${requestId}`, {
      action,
      comment
    });
    return response.data;
  },

  getApprovalHistory: async (requestId) => {
    const response = await api.get(`/approvals/history/${requestId}`);
    return response.data;
  }
};
