import { usePatient } from '../../api/profile';
import { useTranslation } from 'react-i18next';

interface PatientInfoSectionProps {
  patientId: number;
}

const PatientInfoSection = ({ patientId }: PatientInfoSectionProps) => {
  const { t } = useTranslation();
  const { data: patient, isLoading } = usePatient(patientId);

  const calculateAge = (birthDate: string | null | undefined) => {
    if (!birthDate) return t('patient_detail.info.not_specified');
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return `${age} ${t('patient_detail.info.years')}`;
  };

  const formatGender = (gender: string | null | undefined) => {
    if (!gender) return t('patient_detail.info.not_specified');
    return gender === 'male'
      ? t('patient_detail.info.male')
      : gender === 'female'
        ? t('patient_detail.info.female')
        : gender;
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
        {t('patient_detail.info.not_found')}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Основная информация */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t('patient_detail.info.title')}</h2>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="w-32 text-gray-600 font-medium">{t('patient_detail.info.name')}:</div>
            <div className="flex-1 text-gray-900 font-semibold">{patient.full_name || t('patient_detail.info.not_specified')}</div>
          </div>
          <div className="flex items-start">
            <div className="w-32 text-gray-600 font-medium">{t('patient_detail.info.phone')}:</div>
            <div className="flex-1 text-gray-900">{patient.phone || t('patient_detail.info.not_specified')}</div>
          </div>
          <div className="flex items-start">
            <div className="w-32 text-gray-600 font-medium">{t('patient_detail.info.age')}:</div>
            <div className="flex-1 text-gray-900">{calculateAge(patient.birth_date)}</div>
          </div>
          <div className="flex items-start">
            <div className="w-32 text-gray-600 font-medium">{t('patient_detail.info.gender')}:</div>
            <div className="flex-1 text-gray-900">{formatGender(patient.gender)}</div>
          </div>
          {patient.address && (
            <div className="flex items-start">
              <div className="w-32 text-gray-600 font-medium">{t('patient_detail.info.address')}:</div>
              <div className="flex-1 text-gray-900">{patient.address}</div>
            </div>
          )}
        </div>
      </div>

      {/* Дополнительная информация */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t('patient_detail.info.extra')}</h2>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="w-32 text-gray-600 font-medium">{t('patient_detail.info.source')}:</div>
            <div className="flex-1 text-gray-900">{patient.source || t('patient_detail.info.not_specified')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientInfoSection;
