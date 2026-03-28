import api from './api';

export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  read_at: string | null;
  data: Record<string, any> | null;
}

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await api.get('/api/notifications/');
  return response.data;
};

export const getUnreadCount = async (): Promise<number> => {
  const response = await api.get('/api/notifications/unread-count');
  return response.data.unread_count;
};

export const markAsRead = async (id: number): Promise<void> => {
  await api.patch(`/api/notifications/${id}/read`);
};

export const markAllAsRead = async (): Promise<void> => {
  await api.patch('/api/notifications/mark-all-read');
};

export const deleteAllNotifications = async (): Promise<void> => {
  await api.delete('/api/notifications/delete-all');
};
