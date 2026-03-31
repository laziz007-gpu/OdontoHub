import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Nuqta from '../../assets/img/icons/3dots.svg';
import { useTranslation } from 'react-i18next';
import { useMyAppointments, useUpdateAppointment } from '../../api/appointments';
import { Loader2, Trash2, Plus } from 'lucide-react';
import { toast } from '../Shared/Toast';
import AppointmentModal from '../Appointments/AppointmentModal';

interface PatsentProps {
  searchQuery?: string;
}

export default function Patsent({ searchQuery = '' }: PatsentProps) {
  const { t } = useTranslation();
  const { data: appointments = [], isLoading } = useMyAppointments();
  const { mutate: updateStatus } = useUpdateAppointment();
  const [isOpen, setIsOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredAppointments = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return (appointments || []).filter(a => {
      const isConfirmed = a.status === 'confirmed' || a.status === 'completed';
      const appDate = new Date(a.start_time);
      const isToday = appDate >= today && appDate < tomorrow;
      const matchesSearch = !searchQuery || 
                           (a.patient_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (a.service || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      return isConfirmed && isToday && matchesSearch;
    });
  }, [appointments, searchQuery]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-8 mb-8 shadow-sm border border-gray-50 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (filteredAppointments.length === 0 && !searchQuery) {
    return (
      <div className="mb-8">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-white rounded-3xl p-8 shadow-sm border border-gray-50 flex flex-col items-center justify-center gap-4 hover:shadow-md transition-all group active:scale-[0.99]"
        >
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-8 h-8" />
          </div>
          <span className="text-xl font-bold text-gray-900">
            {t('appointments.record_appointment', 'Добавить приём')}
          </span>
        </button>
        <AppointmentModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => setIsModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 mb-8 shadow-sm border border-gray-50">
      <div className="flex justify-between items-center mb-6 px-1">
        <h2 className="text-2xl font-black text-[#1D1D2B] flex items-center gap-3">
          {t('dashboard.appointments_card.title', 'Bugungi qabullar')}
          <span className="bg-[#5377f7] text-white text-sm px-3 py-1 rounded-full font-bold">
            {filteredAppointments.length}
          </span>
        </h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 hover:bg-gray-50 rounded-full transition-all"
        >
          <svg
            className={`w-6 h-6 transform transition-transform text-gray-400 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className={`space-y-4 ${isOpen ? 'block' : 'hidden'}`}>
        {filteredAppointments.map((app) => (
          <div
            key={app.id}
            className="bg-white border border-gray-100 rounded-[28px] p-5 relative group hover:bg-gray-50 transition-all"
          >
            <Link to={`/appointments/${app.id}`} className="absolute inset-0 z-10" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xl">
                  {app.patient_name?.charAt(0) || 'P'}
                </div>
                <div>
                  <h3 className="font-bold text-[#1D1D2B] text-lg leading-tight">
                    {app.patient_name || 'Bemor'}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-gray-400 uppercase">
                      {new Date(app.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 relative z-20">
                <div className="text-right hidden sm:block mr-2">
                   <p className={`text-sm font-bold ${app.status === 'completed' ? 'text-green-500' : 'text-blue-500'}`}>
                     {app.status === 'completed' ? 'Yakunlangan' : 'Tasdiqlangan'}
                   </p>
                </div>
                <div className="flex gap-2 relative z-20">
                  <button 
                    onClick={() => {
                      if (window.confirm("Haqiqatan ham bu qabulni bekor qilmoqchimisiz?")) {
                        updateStatus({ id: app.id, status: 'cancelled' });
                        toast.success("Qabul bekor qilindi");
                      }
                    }}
                    className="h-12 w-12 bg-red-50 hover:bg-red-100 rounded-2xl flex items-center justify-center transition-all group"
                    title="Bekor qilish"
                  >
                    <Trash2 className="w-5 h-5 text-red-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <button className="h-12 w-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <img src={Nuqta} alt="more" className="w-6 h-6 opacity-40" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}