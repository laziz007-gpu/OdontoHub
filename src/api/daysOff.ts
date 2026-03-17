import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './api';

export interface DayOff {
    id: number;
    dentist_id: number;
    date: string;
    reason?: string;
    is_recurring: boolean;
    created_at: string;
}

export interface CreateDayOffData {
    date: string;
    reason?: string;
    is_recurring?: boolean;
}

export interface CreateBulkDayOffData {
    dates: string[];
    reason?: string;
    is_recurring?: boolean;
}

// Получить выходные дни врача
export const useDaysOff = (startDate?: string, endDate?: string) => {
    return useQuery({
        queryKey: ['daysOff', startDate, endDate],
        queryFn: async (): Promise<DayOff[]> => {
            try {
                const params = new URLSearchParams();
                if (startDate) params.append('start_date', startDate);
                if (endDate) params.append('end_date', endDate);
                
                console.log('Making API call to:', `/api/days-off/?${params.toString()}`);
                const response = await api.get(`/api/days-off/?${params.toString()}`);
                console.log('API response:', response);
                return response.data;
            } catch (error) {
                console.error('Days off API error:', error);
                throw error;
            }
        },
        retry: false, // Don't retry on error for debugging
        staleTime: 0, // Always fetch fresh data for debugging
    });
};

// Добавить выходной день
export const useCreateDayOff = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (data: CreateDayOffData): Promise<DayOff> => {
            const response = await api.post('/api/days-off/', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['daysOff'] });
        }
    });
};

// Добавить несколько выходных дней сразу
export const useCreateBulkDaysOff = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (data: CreateBulkDayOffData): Promise<DayOff[]> => {
            const response = await api.post('/api/days-off/bulk', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['daysOff'] });
        }
    });
};

// Удалить выходной день
export const useDeleteDayOff = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (dayOffId: number): Promise<void> => {
            await api.delete(`/api/days-off/${dayOffId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['daysOff'] });
        }
    });
};

// Проверить конкретный день
export const useCheckDayOff = (date: string) => {
    return useQuery({
        queryKey: ['checkDayOff', date],
        queryFn: async (): Promise<{ is_day_off: boolean; reason?: string; is_recurring: boolean }> => {
            const response = await api.get(`/api/days-off/check/${date}`);
            return response.data;
        },
        enabled: !!date
    });
};