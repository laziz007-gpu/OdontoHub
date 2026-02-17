import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
})

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token');

    if (accessToken && accessToken !== null) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
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