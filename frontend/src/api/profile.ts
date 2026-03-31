import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "./api"
import { isPatient, isDentist, isAuthenticated } from "../utils/auth"

export interface Patient {
    id: number;
    user_id: number;
    full_name: string;
    birth_date?: string | null;
    gender?: string | null;
    address?: string | null;
    phone?: string | null;
    source?: string | null;
    status?: string | null;
    dentist_id?: number | null;
}

export interface DentistProfile {
    id: number;
    user_id: number;
    full_name: string;
    pinfl: string | null;
    diploma_number: string | null;
    verification_status: "pending" | "approved" | "rejected";
    specialization?: string;
    phone?: string;
    address?: string;
    clinic?: string;
    schedule?: string;
    work_hours?: string;
    telegram?: string;
    instagram?: string;
    whatsapp?: string;
    latitude?: number | null;
    longitude?: number | null;
    works_photos?: string;
}

export const usePatientProfile = () => {
    const accessToken = localStorage.getItem('access_token')
    return useQuery({
        queryKey: ['patientProfile'],
        queryFn: async () => {
            const response = await api.get<Patient>('/patients/me');
            return response.data;
        },
        enabled: !!accessToken && isAuthenticated() && isPatient(),
    })
}

export const useDentistProfile = () => {
    return useQuery({
        queryKey: ['dentistProfile'],
        queryFn: async () => {
            const response = await api.get<DentistProfile>('/dentists/me');
            return response.data;
        },
        enabled: !!localStorage.getItem('access_token') && isAuthenticated() && isDentist(),
        staleTime: 0,
        refetchOnMount: 'always',
    })
}

export const useAllPatients = () => {
    return useQuery({
        queryKey: ['patients'],
        queryFn: async (): Promise<Patient[]> => {
            const accessToken = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
            const isLocalMode = accessToken?.startsWith('local_token_');

            if (isLocalMode) {
                // In local mode, return ALL stored patients.
                // There's only one doctor's data in localStorage, so no cross-contamination.
                const patients = JSON.parse(localStorage.getItem('patients') || '[]');
                return patients;
            }

            const response = await api.get<Patient[]>('/patients/');
            return response.data;
        },
        enabled: isAuthenticated() && isDentist(),
    });
}

export const useAllDentists = () => {
    return useQuery({
        queryKey: ['dentists'],
        queryFn: async () => {
            const response = await api.get<DentistProfile[]>('/dentists/');
            return response.data;
        },
        retry: false,
        staleTime: 5 * 60 * 1000,
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
        mutationFn: async (data: Omit<Patient, 'id' | 'user_id'> & { source?: string }) => {
            const accessToken = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
            const isLocalMode = accessToken?.startsWith('local_token_');

            if (isLocalMode) {
                const raw = JSON.parse(localStorage.getItem('patients') || '[]');
                const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
                const dentistId = userData.dentist_id || 1;
                
                const newPatient = {
                    ...data,
                    id: Math.max(0, ...raw.map((p: any) => p.id)) + 1,
                    user_id: 0,
                    dentist_id: dentistId,
                    created_at: new Date().toISOString()
                };
                raw.push(newPatient);
                localStorage.setItem('patients', JSON.stringify(raw));
                return newPatient as Patient;
            }

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

export const useUpdateDentistProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Partial<{
            specialization: string;
            phone: string;
            address: string;
            clinic: string;
            schedule: string;
            work_hours: string;
            telegram: string;
            instagram: string;
            whatsapp: string;
            latitude: number;
            longitude: number;
            works_photos: string;
        }>) => {
            const response = await api.put<DentistProfile>('/dentists/me', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dentistProfile'] });
        }
    });
};

export interface DentistStats {
    total_patients: number;
    total_appointments: number;
    completed_appointments: number;
    pending_appointments: number;
    appointments_today: number;
    appointments_this_month: number;
    new_patients_this_week: number;
    average_rating: number;
    total_reviews: number;
}

export const useDentistStats = () => {
    const accessToken = localStorage.getItem('access_token')
    return useQuery({
        queryKey: ['dentistStats'],
        queryFn: async () => {
            const response = await api.get<DentistStats>('/dentists/me/stats');
            return response.data;
        },
        enabled: !!accessToken && isAuthenticated() && isDentist(),
    })
};
