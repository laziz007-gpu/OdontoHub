import { useTranslation } from 'react-i18next';
import { useMyAppointments, useUpdateAppointment } from '../../api/appointments';
import Nuqta from '../../assets/img/icons/3dots.svg';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NewPatients = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { data: appointments = [], isLoading } = useMyAppointments();
    const { mutate: updateStatus } = useUpdateAppointment();

    // Filter for pending appointments (New Patients)
    const newPatients = appointments.filter(a => a.status === 'pending');

    if (isLoading) {
        return (
            <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm border border-gray-50 animate-pulse">
                <div className="h-8 w-48 bg-gray-100 rounded-lg mb-6" />
                <div className="flex gap-4 overflow-hidden">
                    <div className="min-w-[300px] h-48 bg-gray-50 rounded-2xl" />
                    <div className="min-w-[300px] h-48 bg-gray-50 rounded-2xl" />
                </div>
            </div>
        );
    }

    if (newPatients.length === 0) return null;

    const handleAccept = (id: number) => {
        updateStatus({ id, status: 'confirmed' });
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(i18n.language === 'ru' ? 'ru-RU' : 'uz-UZ', {
            day: 'numeric',
            month: 'long'
        });
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="bg-white rounded-3xl p-6 mb-8 shadow-sm border border-gray-50">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-[#1D1D2B] flex items-center gap-3">
                    {t('dashboard.new_patients.title', 'Новые пациенты')}
                    <span className="bg-[#1D1D2B] text-white text-sm px-3 py-1 rounded-full font-bold">
                        {newPatients.length}
                    </span>
                </h2>
                <button 
                    onClick={() => navigate('/appointments')}
                    className="p-3 bg-gray-100/50 hover:bg-gray-100 rounded-full transition-all group active:scale-95"
                >
                    <ChevronRight size={20} className="text-gray-900 group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>

            {/* Carousel Container */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">
                {newPatients.map((patient) => (
                    <div
                        key={patient.id}
                        className="min-w-[280px] sm:min-w-[320px] bg-white border border-gray-100 rounded-[32px] p-5 shadow-xs hover:shadow-md transition-all duration-300 group"
                    >
                        {/* Profile Info */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
                                {patient.patient_name?.[0] || 'P'}
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-bold text-gray-900 text-lg truncate leading-tight">
                                    {patient.patient_name || 'Bemor'}
                                </h3>
                                <p className="text-sm font-bold text-gray-400 mt-0.5">
                                    33 {t('dashboard.new_patients.age_unit', 'года')} {/* Hardcoded age for now as not in Appointment interface */}
                                </p>
                            </div>
                        </div>

                        {/* Appointment Details */}
                        <div className="space-y-3 text-sm mb-5 bg-gray-50 p-4 rounded-2xl">
                            <div className="flex items-center gap-2 font-bold text-gray-600">
                                <span className="bg-white p-1 rounded-md shadow-xs">📅</span>
                                <span>
                                    {formatDate(patient.start_time)} | {formatTime(patient.start_time)}
                                </span>
                            </div>

                            <div className="line-clamp-1">
                                <span className="font-bold text-gray-400 mr-2 uppercase text-[10px] tracking-wider">{t('dashboard.new_patients.comment', 'Комментарии')}:</span>
                                <span className="text-gray-700 font-medium">{patient.notes || t('dashboard.new_patients.no_comment', 'Нет комментария')}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-400 uppercase text-[10px] tracking-wider">{t('dashboard.new_patients.status', 'Статус')}:</span>
                                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                    {t('dashboard.new_patients.status_new', 'Новый')}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button 
                                onClick={() => handleAccept(patient.id)}
                                className="flex-1 bg-[#00D775] hover:bg-[#00c56b] text-white py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-green-500/20 transition-all active:scale-95"
                            >
                                {t('dashboard.new_patients.accept_btn', 'Принять')}
                            </button>

                            <button className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-2xl flex items-center justify-center transition-all active:scale-95 group">
                                <img src={Nuqta} alt="more" className="w-6 h-6 rotate-90 opacity-40 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewPatients;
