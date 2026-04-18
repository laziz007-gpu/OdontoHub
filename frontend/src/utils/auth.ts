export const getToken = (): string | null => {
  return localStorage.getItem('access_token');
};

const isLocalToken = (token: string | null): boolean => {
  return !!token && token.startsWith('local_token_');
};

const parseJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const decoded = atob(padded);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
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
  const token = getToken();
  const user = getUser();

  if (token && !isLocalToken(token)) {
    const role = parseJwtPayload(token)?.role;
    if (role === 'patient' || role === 'dentist') {
      if (user && user.role !== role) {
        localStorage.setItem('user_data', JSON.stringify({ ...user, role }));
      }
      return role;
    }
  }

  return user?.role || null;
};

export const isPatient = (): boolean => getUserRole() === 'patient';
export const isDentist = (): boolean => getUserRole() === 'dentist';

export const logout = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user_data');
  window.location.href = '/login';
};
