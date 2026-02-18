import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDentistProfile } from '../api/profile';
import PatientInfoSection from '../components/Patients/PatientInfoSection';
import PrescriptionSection from '../components/Patients/PrescriptionSection';
import AllergySection from '../components/Patients/AllergySection';
import AppointmentsSection from '../components/Patients/AppointmentsSection';
import PhotosSection from '../components/Patients/PhotosSection';
import PaymentsSection from '../components/Patients/PaymentsSection';

type TabType = 'info' | 'appointments' | 'prescriptions' | 'allergies' | 'photos' | 'payments';

const PatientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const { data: dentistProfile } = useDentistProfile();

  const patientId = parseInt(id || '0');
  const dentistId = dentistProfile?.id || 0;

  const tabs = [
    { id: 'info' as TabType, label: 'Информация', color: 'blue' },
    { id: 'appointments' as TabType, label: 'Приёмы', color: 'purple' },
    { id: 'prescriptions' as TabType, label: 'Рецепты', color: 'blue' },
    { id: 'allergies' as TabType, label: 'Аллергии', color: 'red' },
    { id: 'photos' as TabType, label: 'Фото', color: 'indigo' },
    { id: 'payments' as TabType, label: 'Оплаты', color: 'green' },
  ];

  const getTabColorClass = (tabId: TabType, isActive: boolean) => {
    const colors = {
      blue: isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100',
      red: isActive ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-gray-100',
      green: isActive ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-gray-100',
      purple: isActive ? 'bg-purple-500 text-white' : 'text-gray-600 hover:bg-gray-100',
      indigo: isActive ? 'bg-indigo-500 text-white' : 'text-gray-600 hover:bg-gray-100',
    };
    
    const tab = tabs.find(t => t.id === tabId);
    return colors[tab?.color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-[#E8E8E8] pb-8">
      {/* Header */}
      <div className="bg-white px-4 py-6 flex items-center gap-4 sticky top-0 z-20 rounded-b-[40px] shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center bg-[#1D1D2B] rounded-full p-2 transition-transform active:scale-95"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="text-2xl md:text-3xl font-black text-[#1D1D2B]">Данные пациента</h1>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-6">
        <div className="bg-white rounded-2xl p-2 shadow-sm overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${
                  getTabColorClass(tab.id, activeTab === tab.id)
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 mt-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          {activeTab === 'info' && <PatientInfoSection patientId={patientId} />}
          {activeTab === 'appointments' && <AppointmentsSection patientId={patientId} dentistId={dentistId} />}
          {activeTab === 'prescriptions' && <PrescriptionSection patientId={patientId} />}
          {activeTab === 'allergies' && <AllergySection patientId={patientId} />}
          {activeTab === 'photos' && <PhotosSection patientId={patientId} />}
          {activeTab === 'payments' && <PaymentsSection patientId={patientId} />}
        </div>
      </div>
    </div>
  );
};

export default PatientDetailPage;
