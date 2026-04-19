import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = authService.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    setUser(response.data);
    return response;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    setUser(response.data);
    return response;
  };

  const updateSignaturePin = async (pin, oldPin) => {
    const response = await authService.updateSignaturePin({ signaturePin: pin, oldPin });
    if (response.success) {
      setUser(prev => ({ ...prev, hasSignaturePin: true }));
    }
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateSignaturePin,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
