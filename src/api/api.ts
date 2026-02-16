import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
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
      // 1. Очищаем локальное хранилище (токены, данные пользователя)
      localStorage.removeItem('access_token');

      // 2. Перенаправляем на логин (через window.location или роутер)
      window.location.href = '/login';

      return Promise.reject(new Error('Сессия истекла, авторизуйтесь снова'));
    }
    return Promise.reject(error);
  }
);

export default api