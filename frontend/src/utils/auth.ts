/**
 * Утилиты для работы с авторизацией
 */

export interface UserData {
  id: number;
  phone: string;
  role: 'patient' | 'dentist';
  full_name: string;
  email?: string;
}

/**
 * Получает данные текущего пользователя из localStorage
 */
export const getCurrentUser = (): UserData | null => {
  try {
    const userData = localStorage.getItem('user_data');
    if (!userData) return null;
    
    return JSON.parse(userData);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Получает роль текущего пользователя
 */
export const getCurrentUserRole = (): 'patient' | 'dentist' | null => {
  const user = getCurrentUser();
  return user?.role || null;
};

/**
 * Проверяет, авторизован ли пользователь
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('access_token');
  const user = getCurrentUser();
  
  return !!(token && token !== 'null' && token !== 'undefined' && user);
};

/**
 * Проверяет, является ли пользователь врачом
 */
export const isDentist = (): boolean => {
  return getCurrentUserRole() === 'dentist';
};

/**
 * Проверяет, является ли пользователь пациентом
 */
export const isPatient = (): boolean => {
  return getCurrentUserRole() === 'patient';
};