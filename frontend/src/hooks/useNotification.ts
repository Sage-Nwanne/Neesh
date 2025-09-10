import { useState, useCallback } from 'react';
import { NotificationType } from '../components/Notification';

interface NotificationState {
  type: NotificationType;
  title: string;
  message: string;
  isVisible: boolean;
}

export const useNotification = () => {
  const [notification, setNotification] = useState<NotificationState>({
    type: 'info',
    title: '',
    message: '',
    isVisible: false
  });

  const showNotification = useCallback((
    type: NotificationType,
    title: string,
    message: string
  ) => {
    setNotification({
      type,
      title,
      message,
      isVisible: true
    });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }));
  }, []);

  const showSuccess = useCallback((title: string, message: string) => {
    showNotification('success', title, message);
  }, [showNotification]);

  const showError = useCallback((title: string, message: string) => {
    showNotification('error', title, message);
  }, [showNotification]);

  const showWarning = useCallback((title: string, message: string) => {
    showNotification('warning', title, message);
  }, [showNotification]);

  const showInfo = useCallback((title: string, message: string) => {
    showNotification('info', title, message);
  }, [showNotification]);

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};
