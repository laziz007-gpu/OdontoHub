import { useEffect, useState } from 'react';
import { usePatient } from '../../api/profile';

interface PatientInfoSectionProps {
  patientId: number;
}

const PatientInfoSection = ({ patientId }: PatientInfoSectionProps) => {
  const { data: patient, isLoading } = usePatient(patientId);

  const calculateAge = (birthDate: string | null | undefined) => {
    if (!birthDate) return 'Не указан';
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return `${age} лет`;
  };

  const formatGender = (gender: string | null | undefined) => {
    if (!gender) return 'Не указан';
    return gender === 'male' ? 'Мужской' : gender === 'female' ? 'Женский' : gender;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-8 text-gray-500">
        Информация о пациенте не найдена
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Основная информация */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Личные данные</h2>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="w-32 text-gray-600 font-medium">ФИО:</div>
            <div className="flex-1 text-gray-900 font-semibold">{patient.full_name || 'Не указано'}</div>
          </div>
          <div className="flex items-start">
            <div className="w-32 text-gray-600 font-medium">Телефон:</div>
            <div className="flex-1 text-gray-900">{patient.phone || 'Не указан'}</div>
          </div>
          <div className="flex items-start">
            <div className="w-32 text-gray-600 font-medium">Возраст:</div>
            <div className="flex-1 text-gray-900">{calculateAge(patient.birth_date)}</div>
          </div>
          <div className="flex items-start">
            <div className="w-32 text-gray-600 font-medium">Пол:</div>
            <div className="flex-1 text-gray-900">{formatGender(patient.gender)}</div>
          </div>
          {patient.address && (
            <div className="flex items-start">
              <div className="w-32 text-gray-600 font-medium">Адрес:</div>
              <div className="flex-1 text-gray-900">{patient.address}</div>
            </div>
          )}
        </div>
      </div>

      {/* Дополнительная информация */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Дополнительно</h2>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="w-32 text-gray-600 font-medium">Источник:</div>
            <div className="flex-1 text-gray-900">{patient.source || 'Не указан'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientInfoSection;
