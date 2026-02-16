import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";

export interface Service {
    id: number;
    name: string;
    price: number;
    currency: string;
}

export const useServices = () => {
    return useQuery({
        queryKey: ['services'],
        queryFn: async () => {
            const response = await api.get<Service[]>('/services/');
            return response.data;
        }
    });
};

export const useCreateService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { name: string; price: number }) => {
            const response = await api.post<Service>('/services/', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
        }
    });
};

export const useUpdateService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: { name: string; price: number } }) => {
            // Note: Backend might need PATCH capability or we use PUT. 
            // Implementation plan said PATCH /services/{id} is getting updated.
            // Wait, I implemented the router? Let me check services.py content again to be sure if I missed PATCH.
            // I'll check services.py first just in case, but I'll write this hook assuming I'll fix backend if needed.
            // Actually I should verify backend first.
            const response = await api.patch<Service>(`/services/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
        }
    });
};

export const useDeleteService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const response = await api.delete<Service>(`/services/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
        }
    });
};
