import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  withCredentials: false, // Disable credentials for CORS
  headers: {
    'Content-Type': 'application/json',
  }
})

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token');
    
    // Don't send token for public dentist list endpoint only
    const isPublicEndpoint = config.url === '/dentists/' || config.url === '/dentists';

    if (accessToken && accessToken !== null && !isPublicEndpoint) {
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
    // Don't auto-redirect on 401 — let components handle it
    return Promise.reject(error);
  }
);

export default api