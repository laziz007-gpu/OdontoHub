export const getToken = (): string | null => {
  return localStorage.getItem('access_token');
};

export const getUser = (): any | null => {
  const userStr = localStorage.getItem('user_data');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  return !!token && token !== 'null' && token !== 'undefined';
};

export const getUserRole = (): 'patient' | 'dentist' | null => {
  const user = getUser();
  return user?.role || null;
};

export const isPatient = (): boolean => getUserRole() === 'patient';
export const isDentist = (): boolean => getUserRole() === 'dentist';

export const logout = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user_data');
  window.location.href = '/login';
};
