import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toastMessage, setToastMessage] = useState(null);
  const [timerId, setTimerId] = useState(null);

  const showToast = useCallback((msg) => {
    if (timerId) clearTimeout(timerId);

    setToastMessage(msg);

    const newTimer = setTimeout(() => {
      setToastMessage(null);
    }, 3000);

    setTimerId(newTimer);
  }, [timerId]);

  const hideToast = useCallback(() => {
    if (timerId) clearTimeout(timerId);
    setToastMessage(null);
  }, [timerId]);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast message={toastMessage} onClose={hideToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
