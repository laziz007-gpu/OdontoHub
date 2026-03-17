import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "./api"

export interface Appointment {
<<<<<<< HEAD
  id: number;
  dentist_id: number;
  patient_id: number;
  start_time: string;
  end_time: string;
  status: string;
  service: string | null;
  notes: string | null;
  dentist_name?: string;
  patient_name?: string;
  rating?: number;
  review?: string;
}

export const useAppointment = (id: number) => {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: async () => {
      const response = await api.get<Appointment>(`/appointments/${id}`);
      return response.data;
    },
    enabled: !!id,
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

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      dentist_id: number;
      patient_id: number;
      start_time: string;
      end_time?: string;
      service?: string;
      notes?: string;
    }) => {
      const response = await api.post<Appointment>('/appointments/', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAppointments'] });
    }
  });
=======
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
>>>>>>> 5a553df4cba3528c9d0f8757cfab166f5ee26e83
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

<<<<<<< HEAD
export const createAppointment = async (data: {
  dentist_id: number;
  patient_id: number;
  start_time: string;
  end_time?: string;
  service?: string;
  notes?: string;
}): Promise<Appointment> => {
  const response = await api.post('/appointments/', data);
  return response.data;
};

export const updateAppointment = async (
  appointmentId: number,
  data: Partial<Appointment>
): Promise<Appointment> => {
  const response = await api.patch(`/appointments/${appointmentId}`, data);
  return response.data;
};

export const usePatientAppointments = (patientId: number) => {
  return useQuery({
    queryKey: ['patientAppointments', patientId],
    queryFn: async () => {
      const response = await api.get<Appointment[]>(`/appointments/patient/${patientId}`);
      return response.data;
    },
    enabled: !!patientId,
  });
=======
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
>>>>>>> 5a553df4cba3528c9d0f8757cfab166f5ee26e83
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
        enabled: !!id,
    });
};

export const useStartAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (appointmentId: number) => {
      const response = await api.patch<Appointment>(`/appointments/${appointmentId}`, {
        status: 'in_progress'
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAppointments'] });
      queryClient.invalidateQueries({ queryKey: ['patientAppointments'] });
      queryClient.invalidateQueries({ queryKey: ['timelineAppointments'] });
    }
  });
};

export const useFinishAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (appointmentId: number) => {
      const response = await api.patch<Appointment>(`/appointments/${appointmentId}`, {
        status: 'completed'
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAppointments'] });
      queryClient.invalidateQueries({ queryKey: ['patientAppointments'] });
      queryClient.invalidateQueries({ queryKey: ['timelineAppointments'] });
    }
  });
};
