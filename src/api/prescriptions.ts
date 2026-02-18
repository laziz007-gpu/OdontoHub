import api from './api';
import { Prescription, PrescriptionCreate, PrescriptionUpdate } from '../types/prescription';

export const getPrescriptions = async (patientId: number): Promise<Prescription[]> => {
  const response = await api.get(`/api/patients/${patientId}/prescriptions`);
  return response.data;
};

export const addPrescription = async (
  patientId: number,
  prescription: PrescriptionCreate
): Promise<Prescription> => {
  const response = await api.post(`/api/patients/${patientId}/prescriptions`, prescription);
  return response.data;
};

export const updatePrescription = async (
  patientId: number,
  prescriptionId: number,
  prescription: PrescriptionUpdate
): Promise<Prescription> => {
  const response = await api.patch(`/api/patients/${patientId}/prescriptions/${prescriptionId}`, prescription);
  return response.data;
};

export const deletePrescription = async (patientId: number, prescriptionId: number): Promise<void> => {
  await api.delete(`/api/patients/${patientId}/prescriptions/${prescriptionId}`);
};
