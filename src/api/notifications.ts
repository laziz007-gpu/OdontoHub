import api from './api';
import { Notification, UnreadCount } from '../types/notification';

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await api.get('/api/notifications');
  return response.data;
};

export const getUnreadCount = async (): Promise<number> => {
  const response = await api.get<UnreadCount>('/api/notifications/unread-count');
  return response.data.count;
};

export const markAsRead = async (notificationId: number): Promise<void> => {
  await api.patch(`/api/notifications/${notificationId}/read`);
};

export const markAllAsRead = async (): Promise<void> => {
  await api.post('/api/notifications/mark-all-read');
};
