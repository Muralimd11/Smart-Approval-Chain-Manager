import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      sessionStorage.setItem('token', response.data.data.token);
      sessionStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.success) {
      sessionStorage.setItem('token', response.data.data.token);
      sessionStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  logout: () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = '/login';
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get('/auth/users');
    return response.data;
  },

  updateSignaturePin: async (pinData) => {
    const response = await api.put('/auth/signature-pin', pinData);
    if (response.data.success) {
      // Update session storage
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (user) {
        user.hasSignaturePin = true;
        sessionStorage.setItem('user', JSON.stringify(user));
      }
    }
    return response.data;
  },

  forgotSignaturePin: async () => {
    const response = await api.post('/auth/forgot-signature-pin');
    return response.data;
  },

  resetSignaturePin: async (token, signaturePin) => {
    const response = await api.put(`/auth/reset-signature-pin/${token}`, { signaturePin });
    return response.data;
  },

  updatePassword: async (passwordData) => {
    const response = await api.put('/auth/update-password', passwordData);
    return response.data;
  },

  adminCreateUser: async (userData) => {
    const response = await api.post('/auth/admin/users', userData);
    return response.data;
  },

  isAuthenticated: () => {
    return !!sessionStorage.getItem('token');
  },

  getUser: () => {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};
