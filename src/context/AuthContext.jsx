import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState({ name: 'Tanmay', email: 'tanmay@sitelog.in' });

  const startDemoMode = () => {
    setIsDemoMode(true);
    setIsAuthenticated(true);
    setUser({ name: 'Tanmay (Demo)', email: 'demo@sitelog.in' });
  };

  const login = (email, password) => {
    setIsDemoMode(false);
    setIsAuthenticated(true);
    setUser({ name: email.split('@')[0] || 'Contractor', email });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsDemoMode(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isDemoMode,
        isAuthenticated,
        user,
        startDemoMode,
        login,
        logout
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
