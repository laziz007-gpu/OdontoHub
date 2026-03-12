import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "./api"

export interface Appointment {
    id: number;
    dentist_id: number;
    patient_id: number;
    start_time: string;
    end_time: string;
    status: "pending" | "confirmed" | "moved" | "cancelled" | "completed";
    service?: string | null;
    notes?: string | null;
    cancel_reason?: string | null;
    dentist_name?: string;
    patient_name?: string;
}

export interface AppointmentCreate {
    dentist_id: number;
    start_time: string;
    end_time: string;
    service?: string;
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
    const accessToken = localStorage.getItem('access_token');
    return useQuery({
        queryKey: ['myAppointments'],
        queryFn: async () => {
            const response = await api.get<Appointment[]>('/appointments/me');
            return response.data;
        },
        enabled: !!accessToken,
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
