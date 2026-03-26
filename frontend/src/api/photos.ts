import api from './api';

export interface PatientPhoto {
  id: number;
  patient_id: number;
  title: string;
  file_url: string;
  category: string;
  description: string | null;
  uploaded_at: string;
  uploaded_by: number | null;
}

export const getPatientPhotos = async (
  patientId: number,
  category?: string
): Promise<PatientPhoto[]> => {
  const params = category ? { category } : {};
  const response = await api.get(`/api/patients/${patientId}/photos`, { params });
  return response.data;
};

export const createPhoto = async (
  patientId: number,
  data: {
    title: string;
    file_url: string;
    category: string;
    description?: string;
  }
): Promise<PatientPhoto> => {
  const response = await api.post(`/api/patients/${patientId}/photos`, data);
  return response.data;
};

export const updatePhoto = async (
  patientId: number,
  photoId: number,
  data: Partial<PatientPhoto>
): Promise<PatientPhoto> => {
  const response = await api.patch(`/api/patients/${patientId}/photos/${photoId}`, data);
  return response.data;
};

export const deletePhoto = async (patientId: number, photoId: number): Promise<void> => {
  await api.delete(`/api/patients/${patientId}/photos/${photoId}`);
};
