// Утилиты для работы с аутентификацией

export interface User {
  id: number;
  email: string;
  role: 'patient' | 'dentist';
  is_active: boolean;
}

// Получить токен из localStorage
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Сохранить токен в localStorage
export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

// Удалить токен из localStorage
export const removeToken = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Получить данные пользователя из localStorage
export const getUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

// Сохранить данные пользователя в localStorage
export const setUser = (user: User): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Проверить авторизован ли пользователь
export const isAuthenticated = (): boolean => {
  const token = getToken();
  const user = getUser();
  return !!(token && user);
};

// Проверить роль пользователя
export const getUserRole = (): 'patient' | 'dentist' | null => {
  const user = getUser();
  return user?.role || null;
};

// Проверить является ли пользователь пациентом
export const isPatient = (): boolean => {
  return getUserRole() === 'patient';
};

// Проверить является ли пользователь врачом
export const isDentist = (): boolean => {
  return getUserRole() === 'dentist';
};

// Выйти из системы
export const logout = (): void => {
  removeToken();
  window.location.href = '/login';
};