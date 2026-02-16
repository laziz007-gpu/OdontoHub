import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "./api"

export interface Patient {
    id: number;
    user_id: number;
    full_name: string;
    birth_date?: string | null;
    gender?: string | null;
    address?: string | null;
    phone?: string | null;
    source?: string | null;
}

export interface DentistProfile {
    id: number;
    user_id: number;
    full_name: string;
    pinfl: string | null;
    diploma_number: string | null;
    verification_status: "pending" | "approved" | "rejected";
}

export const usePatientProfile = () => {
    const accessToken = localStorage.getItem('access_token')
    return useQuery({
        queryKey: ['patientProfile'],
        queryFn: async () => {
            const response = await api.get<Patient>('/patients/me');
            return response.data;
        },
        enabled: !!accessToken,
    })
}

export const useDentistProfile = () => {
    const accessToken = localStorage.getItem('access_token')
    return useQuery({
        queryKey: ['dentistProfile'],
        queryFn: async () => {
            const response = await api.get<DentistProfile>('/dentists/me');
            return response.data;
        },
        enabled: !!accessToken,
    })
}

export const useAllPatients = () => {
    return useQuery({
        queryKey: ['patients'],
        queryFn: async () => {
            const response = await api.get<Patient[]>('/patients/');
            return response.data;
        }
    });
}

export const usePatient = (id: number) => {
    return useQuery({
        queryKey: ['patient', id],
        queryFn: async () => {
            const response = await api.get<Patient>(`/patients/${id}`);
            return response.data;
        },
        enabled: !!id
    });
}

export const useCreatePatient = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Omit<Patient, 'id' | 'user_id'>) => {
            const response = await api.post<Patient>('/patients/', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patients'] });
        }
    });
};

export const useUpdatePatient = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...data }: { id: number } & Partial<Omit<Patient, 'id' | 'user_id'>>) => {
            const response = await api.patch<Patient>(`/patients/${id}`, data);
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['patients'] });
            queryClient.invalidateQueries({ queryKey: ['patient', variables.id] });
        }
    });
};

export const useDeletePatient = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const response = await api.delete<{ message: string }>(`/patients/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patients'] });
        }
    });
};
