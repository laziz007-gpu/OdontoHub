import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Nuqta from '../../assets/img/icons/3dots.svg';
import { useTranslation } from 'react-i18next';

type Patient = {
  id: number;
  name: string;
  age: number;
  date: string;
  time: string;
  comment: string;
  status: 'Новый' | 'Срочный' | 'new' | 'urgent';
};

const patients: Patient[] = [
  {
    id: 1,
    name: "Алишер Насруллаев",
    age: 33,
    date: "15 Января",
    time: "9:00",
    comment: "Сильно болят зубы",
    status: "new",
  },
  {
    id: 2,
    name: "Зарина Каримова",
    age: 28,
    date: "15 Января",
    time: "10:30",
    comment: "Консультация",
    status: "urgent",
  },
  {
    id: 3,
    name: "Сардор Умаров",
    age: 45,
    date: "15 Января",
    time: "14:00",
    comment: "Удаление зуба",
    status: "new",
  },
];


interface NewPatientsProps {
  searchQuery?: string;
}

export default function NewPatients({ searchQuery = '' }: NewPatientsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (searchQuery) {
      setIsOpen(true);
    }
  }, [searchQuery]);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.comment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm" style={{ display: 'none' }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-3">
          {t('dashboard.new_patients.title')}
          <span className="bg-black text-white text-sm px-3 py-1 rounded-full font-semibold">
            {filteredPatients.length}
          </span>
        </h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg
            className={`w-6 h-6 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Kartalar - vertikal ro'yxat */}
      <div className="space-y-4">
        {(isOpen ? filteredPatients : filteredPatients.slice(0, 1)).map((patient, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-2xl p-5 border border-gray-100 relative group transition-colors hover:bg-gray-100"
          >
            <Link to={`/patients/${patient.id}`} className="absolute inset-0 z-10" />
            {/* Ism va avatar */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-xl shrink-0">
                  {patient.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">
                    {patient.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {patient.age} {t('dashboard.new_patients.age_label')}
                  </p>
                </div>
              </div>
            </div>

            {/* Ma'lumotlar */}
            <div className="space-y-2.5 text-sm text-gray-700 mb-5">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">📅</span>
                <span>
                  {patient.date} | {patient.time}
                </span>
              </div>

              <div>
                <span className="font-medium text-gray-800">{t('dashboard.new_patients.comment')} </span>
                {patient.comment}
              </div>

              <div>
                <span className="font-medium text-gray-800">{t('dashboard.new_patients.status_label')} </span>
                <span
                  className={
                    patient.status === 'new' || patient.status === 'Новый'
                      ? 'text-green-600 font-semibold'
                      : 'text-red-600 font-semibold'
                  }
                >
                  {patient.status === 'new' || patient.status === 'Новый' ? t('dashboard.new_patients.today') : t('dashboard.new_patients.urgent')}
                </span>
              </div>
            </div>

            {/* Tugmalar */}
            <div className="flex gap-3 relative z-20">
              <button
                onClick={() => navigate('/appointments')}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition-colors"
              >
                {t('dashboard.new_patients.accept')}
              </button>

              <button className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-xl flex items-center justify-center transition-colors">
                <img src={Nuqta} alt="more" className="w-6 h-6" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pastki qism - Быстрые действия */}
      {isOpen && (
        <div className="mt-8 pt-6 border-t border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            {t('dashboard.new_patients.quick_actions')}
          </h3>
          <div className="flex flex-wrap gap-3">
            <button className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium">
              {t('dashboard.new_patients.today')}
            </button>
            <button className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium">
              {t('dashboard.new_patients.no_comment')}
            </button>
            <button className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium">
              {t('dashboard.new_patients.urgent')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}