import { useMutation, useQuery } from "@tanstack/react-query"
import type { RegisterData } from "../interfaces"
import api from "./api"

export const useRegister = () => {
    const mutation = useMutation({

        /* Это функция делает запрос */
        mutationFn: (data: RegisterData) => api.post('/auth/register'),

        /* Функция сработает если, ответ положительный и есть данные, мы их получим в response */
        onSuccess: (response) => {
            console.log(response);
        },

        /* Если ошибка, то получим в error */
        onError: (error) => {
            setTimeout(() => {
          }, 3000);
        },
    });
    return { ...mutation }
};

export const useLogin = () => {
    const mutation = useMutation({
        mutationFn: (data) => api.post('/auth/login', data),
        onSuccess: ({ data }) => {
          if (data && data.access) {
            localStorage.setItem('access_token', data.access)
          }
        },
        onError: (error) => {
            setTimeout(() => {
          }, 3000); 
          console.log(error); 
        },
    });
    return { ...mutation }
};

export const useCurrentUser = () => {
  const accessToken = localStorage.getiTem('access_token')
  return useQuery({
    queryKey: ['current'],
    queryFn: () => api.get('/auth/me'),
    enabled: !!accessToken,
    select: (response) => response.data
  })
}


