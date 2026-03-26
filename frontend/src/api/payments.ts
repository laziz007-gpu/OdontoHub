import api from './api';

export interface Payment {
  id: number;
  patient_id: number;
  appointment_id: number | null;
  amount: number;
  paid_amount: number;
  service_name: string;
  payment_date: string;
  status: string;
  notes: string | null;
  recorded_by: number | null;
}

export interface PaymentStats {
  total_amount: number;
  total_paid: number;
  total_debt: number;
}

export const getPatientPayments = async (patientId: number): Promise<Payment[]> => {
  const response = await api.get(`/api/patients/${patientId}/payments`);
  return response.data;
};

export const getPaymentStats = async (patientId: number): Promise<PaymentStats> => {
  const response = await api.get(`/api/patients/${patientId}/payments/stats`);
  return response.data;
};

export const createPayment = async (
  patientId: number,
  data: {
    amount: number;
    paid_amount?: number;
    service_name: string;
    appointment_id?: number;
    status?: string;
    notes?: string;
  }
): Promise<Payment> => {
  const response = await api.post(`/api/patients/${patientId}/payments`, data);
  return response.data;
};

export const updatePayment = async (
  patientId: number,
  paymentId: number,
  data: Partial<Payment>
): Promise<Payment> => {
  const response = await api.patch(`/api/patients/${patientId}/payments/${paymentId}`, data);
  return response.data;
};

export const deletePayment = async (patientId: number, paymentId: number): Promise<void> => {
  await api.delete(`/api/patients/${patientId}/payments/${paymentId}`);
};
