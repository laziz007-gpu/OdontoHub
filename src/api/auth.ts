import { useMutation, useQuery } from "@tanstack/react-query"
import type { RegisterData, LoginData, TokenResponse } from "../interfaces"
import api from "./api"

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterData) =>
      api.post<TokenResponse>('/auth/register', data),

    onSuccess: ({ data }) => {
      if (data?.access_token) {
        localStorage.setItem('access_token', data.access_token)
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
      // Backend expects OAuth2 form-data (application/x-www-form-urlencoded)
      const formData = new URLSearchParams()
      formData.append('username', data.username)
      formData.append('password', data.password)

      return api.post<TokenResponse>('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
    },

    onSuccess: ({ data }) => {
      if (data?.access_token) {
        localStorage.setItem('access_token', data.access_token)
      }
    },

    onError: (error) => {
      console.error('Login error:', error)
    },
  })
}

export const useCurrentUser = () => {
  const accessToken = localStorage.getItem('access_token')
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => api.get('/auth/me'),
    enabled: !!accessToken,
    select: (response) => response.data,
  })
}
