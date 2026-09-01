import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true while restoring session on app load

  // On app load, ask the backend if the httpOnly cookie still represents a valid session
  useEffect(() => {
    let cancelled = false;

    API.get('/auth/me')
      .then((res) => {
        if (cancelled) return;
        setUser(res.data.user);
        setIsAuthenticated(true);
      })
      .catch(() => {
        if (cancelled) return;
        setUser(null);
        setIsAuthenticated(false);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const startDemoMode = () => {
    setIsDemoMode(true);
    setIsAuthenticated(true);
    setUser({ name: 'Tanmay (Demo)', email: 'demo@terracore.ai' });
  };

  // Returns { success, error?, requiresOtp?, userId? } so the calling page can react
  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      setIsDemoMode(false);
      setIsAuthenticated(true);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      const data = err.response?.data;
      if (data?.requiresOtp) {
        return { success: false, requiresOtp: true, userId: data.userId, error: data.msg };
      }
      return { success: false, error: data?.msg || 'Something went wrong. Please try again.' };
    }
  };

  // Returns { success, userId?, error? } — does NOT log the user in; OTP verification does that
  const register = async (formData) => {
    try {
      const res = await API.post('/auth/register', formData);
      return { success: true, userId: res.data.userId };
    } catch (err) {
      return { success: false, error: err.response?.data?.msg || 'Registration failed.' };
    }
  };

  // Returns { success, error? }; on success, cookie is set and user is now authenticated
  const verifyOtp = async (userId, otp) => {
    try {
      const res = await API.post('/auth/verify-otp', { userId, otp });
      setIsDemoMode(false);
      setIsAuthenticated(true);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.msg || 'Verification failed.' };
    }
  };

  const resendOtp = async (userId) => {
    try {
      await API.post('/auth/resend-otp', { userId });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.msg || 'Could not resend code.' };
    }
  };

  const forgotPassword = async (email, role) => {
    try {
      const res = await API.post('/auth/forgot-password', { email, role });
      return { success: true, userId: res.data.userId };
    } catch (err) {
      return { success: false, error: err.response?.data?.msg || 'Something went wrong.' };
    }
  };

  const resetPassword = async (userId, otp, newPassword) => {
    try {
      await API.post('/auth/reset-password', { userId, otp, newPassword });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.msg || 'Could not reset password.' };
    }
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout');
    } catch {
      // even if the request fails, clear local state so the UI reflects signed-out
    }
    setIsAuthenticated(false);
    setIsDemoMode(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isDemoMode,
        isAuthenticated,
        isLoading,
        user,
        startDemoMode,
        login,
        register,
        verifyOtp,
        resendOtp,
        forgotPassword,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}