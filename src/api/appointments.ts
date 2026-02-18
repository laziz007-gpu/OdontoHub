import api from './api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Appointment {
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
}

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
      end_time: string;
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
};

export const getPatientAppointments = async (patientId: number): Promise<Appointment[]> => {
  const response = await api.get(`/appointments/patient/${patientId}`);
  return response.data;
};

export const createAppointment = async (data: {
  dentist_id: number;
  patient_id: number;
  start_time: string;
  end_time: string;
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
};

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (appointmentId: number) => {
      const response = await api.patch<Appointment>(`/appointments/${appointmentId}`, {
        status: 'cancelled'
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAppointments'] });
      queryClient.invalidateQueries({ queryKey: ['patientAppointments'] });
    }
  });
};

export const useRescheduleAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ appointmentId, start_time, end_time }: {
      appointmentId: number;
      start_time: string;
      end_time: string;
    }) => {
      const response = await api.patch<Appointment>(`/appointments/${appointmentId}`, {
        start_time,
        end_time,
        status: 'moved'
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAppointments'] });
      queryClient.invalidateQueries({ queryKey: ['patientAppointments'] });
    }
  });
};
