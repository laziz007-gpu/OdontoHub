import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "./api"
import { isAuthenticated } from '../utils/auth';

export interface Appointment {
    id: number;
    dentist_id: number;
    patient_id: number;
    start_time: string;
    end_time: string;
    status: "pending" | "confirmed" | "moved" | "cancelled" | "completed";
    service?: string | null;
    price?: number | null;
    notes?: string | null;
    cancel_reason?: string | null;
    dentist_name?: string;
    patient_name?: string;
}

export interface AppointmentCreate {
    dentist_id: number;
    patient_id?: number;
    start_time: string;
    end_time: string;
    service?: string;
    price?: number;
    notes?: string;
}

export const useCreateAppointment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: AppointmentCreate) => {
            const response = await api.post<Appointment>('/appointments/', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            queryClient.invalidateQueries({ queryKey: ['myAppointments'] });
        }
    });
};

export const useMyAppointments = () => {
    const useApi = import.meta.env.VITE_USE_API !== 'false';

    return useQuery({
        queryKey: ['myAppointments'],
        queryFn: async (): Promise<Appointment[]> => {
            const accessToken = localStorage.getItem('access_token');
            const isLocalMode = accessToken?.startsWith('local_token_');
            // Local mode — read from localStorage
            if (isLocalMode || !useApi) {
                const raw = JSON.parse(localStorage.getItem('appointments') || '[]');
                const userData = JSON.parse(localStorage.getItem('user_data') || '{}');

                // Convert local appointment format to Appointment interface
                return raw.map((a: any) => {
                    // Parse date+time into ISO string
                    let start_time = a.start_time || a.created_at || new Date().toISOString();
                    if (a.date && a.time) {
                        // date is like "24.03.2026", time is "10:00"
                        const parts = a.date.split('.');
                        if (parts.length === 3) {
                            start_time = `${parts[2]}-${parts[1]}-${parts[0]}T${a.time}:00`;
                        }
                    }
                    const end_time = a.end_time || new Date(new Date(start_time).getTime() + 60 * 60 * 1000).toISOString();

                    return {
                        id: a.id,
                        dentist_id: a.doctor_id || 2,
                        patient_id: a.patient_id || 1,
                        start_time,
                        end_time,
                        status: (a.status === 'upcoming' ? 'pending' : a.status === 'past' ? 'completed' : a.status) as Appointment['status'],
                        service: a.service || null,
                        price: a.price || null,
                        notes: a.comment || null,
                        dentist_name: a.doctor_name || 'Доктор',
                        patient_name: a.patient_name || userData.full_name || 'Пациент',
                    };
                });
            }

            const response = await api.get<Appointment[]>('/appointments/me');
            return response.data;
        },
        enabled: isAuthenticated(),
        staleTime: 0,
        refetchOnMount: 'always',
        refetchOnWindowFocus: true,
    });
};

export const useUpdateAppointment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...data }: { id: number } & Partial<Appointment>) => {
            const response = await api.patch<Appointment>(`/appointments/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            queryClient.invalidateQueries({ queryKey: ['myAppointments'] });
        }
    });
};

export const useCancelAppointment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, reason }: { id: number; reason?: string }) => {
            const response = await api.patch<Appointment>(`/appointments/${id}`, {
                status: 'cancelled',
                cancel_reason: reason
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            queryClient.invalidateQueries({ queryKey: ['myAppointments'] });
        }
    });
};

export const useRescheduleAppointment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, start_time, end_time }: { id: number; start_time: string; end_time: string }) => {
            const response = await api.patch<Appointment>(`/appointments/${id}`, {
                start_time,
                end_time,
                status: 'moved'
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            queryClient.invalidateQueries({ queryKey: ['myAppointments'] });
        }
    });
};

// Direct API call for getting patient appointments (for dentist view)
export const getPatientAppointments = async (patientId: number): Promise<Appointment[]> => {
    const response = await api.get<Appointment[]>(`/appointments/patient/${patientId}`);
    return response.data;
};

// Get single appointment by ID
export const useAppointment = (id: number) => {
    return useQuery({
        queryKey: ['appointment', id],
        queryFn: async () => {
            const response = await api.get<Appointment>(`/appointments/${id}`);
            return response.data;
        },
        enabled: !!id && isAuthenticated(),
    });
};
