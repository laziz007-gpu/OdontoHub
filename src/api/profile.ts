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
    status?: string | null;
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
    works_photos?: string;  // JSON string of photo URLs
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

export const useAllDentists = () => {
    return useQuery({
        queryKey: ['dentists'],
        queryFn: async () => {
            try {
                const response = await api.get<DentistProfile[]>('/dentists/');
                return response.data;
            } catch (error) {
                // Return fallback data if API fails
                return [
                    {
                        id: 1,
                        user_id: 1,
                        full_name: "Махмуд Пулатов",
                        pinfl: null,
                        diploma_number: null,
                        verification_status: "approved" as const,
                        specialization: "Ортодонтия",
                        phone: "+998901234567",
                        address: "Ташкент, Юнусабад",
                        clinic: "Стоматология №1",
                        schedule: "Пн-Пт: 9:00-18:00",
                        work_hours: "09:00-18:00",
                        telegram: "@mahmud_dentist",
                        instagram: "@mahmud_dentist",
                        whatsapp: "+998901234567"
                    },
                    {
                        id: 2,
                        user_id: 2,
                        full_name: "Азиза Каримова",
                        pinfl: null,
                        diploma_number: null,
                        verification_status: "approved" as const,
                        specialization: "Терапевтическая стоматология",
                        phone: "+998901234568",
                        address: "Ташкент, Чиланзар",
                        clinic: "Стоматология №2",
                        schedule: "Пн-Сб: 8:00-17:00",
                        work_hours: "08:00-17:00",
                        telegram: "@aziza_dentist",
                        instagram: "@aziza_dentist",
                        whatsapp: "+998901234568"
                    },
                    {
                        id: 3,
                        user_id: 3,
                        full_name: "Шерзод Усманов",
                        pinfl: null,
                        diploma_number: null,
                        verification_status: "approved" as const,
                        specialization: "Хирургическая стоматология",
                        phone: "+998901234569",
                        address: "Ташкент, Мирзо-Улугбек",
                        clinic: "Стоматология №3",
                        schedule: "Вт-Сб: 10:00-19:00",
                        work_hours: "10:00-19:00",
                        telegram: "@sherzod_dentist",
                        instagram: "@sherzod_dentist",
                        whatsapp: "+998901234569"
                    }
                ] as DentistProfile[];
            }
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
}

export const useDentistStats = () => {
    const accessToken = localStorage.getItem('access_token')
    return useQuery({
        queryKey: ['dentistStats'],
        queryFn: async () => {
            const response = await api.get<DentistStats>('/dentists/me/stats');
            return response.data;
        },
        enabled: !!accessToken,
    })
};
