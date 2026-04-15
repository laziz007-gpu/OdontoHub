import { useMutation, useQuery } from "@tanstack/react-query"
import type { RegisterData, LoginData, TokenResponse } from "../interfaces"
import api from "./api"

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterData) =>
      api.post<TokenResponse>('/auth/register', data),

    onSuccess: async ({ data }) => {
      if (data?.access_token) {
        localStorage.setItem('access_token', data.access_token)
        
        // Получаем данные пользователя после успешной регистрации
        try {
          const userResponse = await api.get('/auth/me')
          if (userResponse.data) {
            localStorage.setItem('user_data', JSON.stringify(userResponse.data))
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error)
        }
      }
    },

    onError: (error) => {
      console.error('Register error:', error)
    },
  })
}

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginData) => {
      // Отправляем телефон и пароль в JSON формате
      return api.post<TokenResponse>('/auth/login', data)
    },

    onSuccess: async ({ data }) => {
      if (data?.access_token) {
        localStorage.setItem('access_token', data.access_token)
        
        // Получаем данные пользователя после успешного логина
        try {
          const userResponse = await api.get('/auth/me')
          if (userResponse.data) {
            localStorage.setItem('user_data', JSON.stringify(userResponse.data))
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error)
        }
      }
    },

    onError: (error) => {
      console.error('Login error:', error)
    },
  })
}

export const useCurrentUser = () => {
  const accessToken = localStorage.getItem('access_token')
  const isLocalMode = accessToken?.startsWith('local_token_')
  
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => api.get('/auth/me'),
    enabled: !!accessToken && !isLocalMode, // Disable if local mode
    select: (response) => response.data,
  })
}

// Change password function
export const changePassword = async (data: { current_password: string; new_password: string }) => {
  const response = await api.put('/auth/change-password', data)
  return response.data
}

export const getBackupPhone = async (): Promise<{ backup_phone: string | null }> => {
  const response = await api.get('/auth/backup-phone')
  return response.data
}

export const updateBackupPhone = async (data: { backup_phone: string | null }) => {
  const response = await api.put('/auth/backup-phone', data)
  return response.data
}
