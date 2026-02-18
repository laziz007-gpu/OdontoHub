import api from './api';
import { Allergy, AllergyCreate, AllergyUpdate } from '../types/allergy';

export const getAllergies = async (patientId: number): Promise<Allergy[]> => {
  const response = await api.get(`/api/patients/${patientId}/allergies`);
  return response.data;
};

export const addAllergy = async (
  patientId: number,
  allergy: AllergyCreate
): Promise<Allergy> => {
  const response = await api.post(`/api/patients/${patientId}/allergies`, allergy);
  return response.data;
};

export const updateAllergy = async (
  patientId: number,
  allergyId: number,
  allergy: AllergyUpdate
): Promise<Allergy> => {
  const response = await api.patch(`/api/patients/${patientId}/allergies/${allergyId}`, allergy);
  return response.data;
};

export const deleteAllergy = async (patientId: number, allergyId: number): Promise<void> => {
  await api.delete(`/api/patients/${patientId}/allergies/${allergyId}`);
};
