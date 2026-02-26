import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  withCredentials: true,
})

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token');

    if (accessToken && accessToken !== null) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    // Bypass localtunnel warning page
    config.headers['Bypass-Tunnel-Reminder'] = 'true';
    
    return config;
  },

  (error) => Promise.reject(error),

)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      const isLoginPage = window.location.pathname === '/login';
      const isRegisterPage = window.location.pathname.includes('/register');
      
      // Если это страница логина или регистрации, просто возвращаем ошибку
      if (isLoginPage || isRegisterPage) {
        return Promise.reject(error);
      }
      
      // Для остальных страниц - сессия истекла
      localStorage.removeItem('access_token');
      window.location.href = '/login';
      return Promise.reject(new Error('Сессия истекла, авторизуйтесь снова'));
    }
    return Promise.reject(error);
  }
);

export default api