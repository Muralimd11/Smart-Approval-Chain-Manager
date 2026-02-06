import React, { createContext, useState, useEffect, useContext } from 'react';
import { SocketContext } from './SocketContext';
import { useAuth } from '../hooks/useAuth';
import { notificationService } from '../services/notificationService';
import toast from 'react-hot-toast';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { socket } = useContext(SocketContext);
  const { isAuthenticated } = useAuth();
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !hasFetched) {
      fetchNotifications();
      fetchUnreadCount();
      setHasFetched(true);
    } else if (!isAuthenticated && hasFetched) {
      setNotifications([]);
      setUnreadCount(0);
      setHasFetched(false);
    }
  }, [isAuthenticated, hasFetched]);

  useEffect(() => {
    if (socket) {
      socket.on('notification', (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        toast.success(notification.message, {
          duration: 4000,
          position: 'top-right'
        });
      });

      return () => {
        socket.off('notification');
      };
    }
  }, [socket]);

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getNotifications();
      if (response.success) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === id ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refreshNotifications: fetchNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};