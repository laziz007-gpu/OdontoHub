import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import api from "./api"

export interface Appointment {
    id: number
    dentist_id: number
    patient_id: number
    dentist_name?: string
    patient_name?: string
    start_time: string
    end_time: string
    status: 'pending' | 'confirmed' | 'moved' | 'cancelled' | 'completed'
    cancel_reason?: string
    service?: string
    notes?: string
}

export interface CreateAppointmentData {
    dentist_id: number
    patient_id?: number | null
    start_time: string
    end_time: string
    service?: string
    notes?: string
}

export const useMyAppointments = () => {
    return useQuery({
        queryKey: ['appointments', 'me'],
        queryFn: async () => {
            const { data } = await api.get<Appointment[]>('/appointments/me')
            return data
        },
    })
}

export const useCreateAppointment = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: CreateAppointmentData) => {
            const { data: responseData } = await api.post<Appointment>('/appointments/', data)
            return responseData
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['appointments', 'me'] });
            if (variables.patient_id) {
                queryClient.invalidateQueries({ queryKey: ['appointments', 'patient', variables.patient_id] });
            }
        },
    })
}

export const useUpdateAppointment = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, ...data }: Partial<Appointment> & { id: number }) => {
            const { data: responseData } = await api.patch<Appointment>(`/appointments/${id}`, data)
            return responseData
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments', 'me'] })
        },
    })
}

export const usePatientAppointments = (patientId: number) => {
    return useQuery({
        queryKey: ['appointments', 'patient', patientId],
        queryFn: async () => {
            const { data } = await api.get<Appointment[]>(`/appointments/patient/${patientId}`)
            return data
        },
        enabled: !!patientId,
    })
}
