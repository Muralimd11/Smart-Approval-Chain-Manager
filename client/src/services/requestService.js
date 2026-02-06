import api from './api';

export const requestService = {
  createRequest: async (formData) => {
    const response = await api.post('/requests', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  getMyRequests: async () => {
    const response = await api.get('/requests/my-requests');
    return response.data;
  },

  getAllRequests: async () => {
    const response = await api.get('/requests');
    return response.data;
  },

  getRequest: async (id) => {
    const response = await api.get(`/requests/${id}`);
    return response.data;
  }
};
