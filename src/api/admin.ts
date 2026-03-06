import api from './api';
import type { DentistForAdmin } from '../interfaces';

// Get all dentists from backend
export const getAllDentists = async () => {
  const response = await api.get<DentistForAdmin[]>('/dentists/list');
  return response.data;
};

// Get specific dentist by ID
export const getDentistById = async (dentistId: number) => {
  const response = await api.get<DentistForAdmin>(`/dentists/${dentistId}`);
  return response.data;
};

// Update dentist verification status
export const updateDentistStatus = async (
  dentistId: number,
  status: 'approved' | 'rejected' | 'pending'
) => {
  const response = await api.put(`/dentists/${dentistId}/status`, {
    verification_status: status
  });
  return response.data;
};

// Delete dentist
export const deleteDentist = async (dentistId: number) => {
  const response = await api.delete(`/dentists/${dentistId}`);
  return response.data;
};