import React, { createContext, useContext, useState, useCallback } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const notification = { id, message, type };
    
    setNotifications((prev) => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const showSuccess = useCallback(
    (message, duration = 3000) => showNotification(message, 'success', duration),
    [showNotification]
  );

  const showError = useCallback(
    (message, duration = 5000) => showNotification(message, 'error', duration),
    [showNotification]
  );

  const showWarning = useCallback(
    (message, duration = 4000) => showNotification(message, 'warning', duration),
    [showNotification]
  );

  const value = {
    notifications,
    showNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within UIProvider');
  }
  return context;
};
