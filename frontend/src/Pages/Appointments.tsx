import React, { useState, useMemo } from 'react';
import { ChevronLeft, Calculator } from 'lucide-react';
import DateStrip from '../components/Appointments/DateStrip';
import AppointmentCard, { type AppointmentStatus } from '../components/Appointments/AppointmentCard';
import CalendarView from '../components/Appointments/CalendarView';
import AppointmentModal from '../components/Appointments/AppointmentModal';
import AppointmentDetailModal from '../components/Appointments/AppointmentDetailModal';
import InProgressView from '../components/Appointments/InProgressView';
import { toast } from '../components/Shared/Toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMyAppointments } from '../api/appointments';
import { useServices } from '../api/services';

const Appointments: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [view, setView] = useState<'list' | 'calendar' | 'in_progress'>('list');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const { data: apiAppointments, isLoading } = useMyAppointments();
    const { data: services } = useServices();

    // All appointments mapped to display format (no date filter)
    const allAppointmentsData = useMemo(() => {
        if (!apiAppointments || !Array.isArray(apiAppointments)) return [];

        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        const accessToken = localStorage.getItem('access_token');
        const isLocalMode = accessToken?.startsWith('local_token_');

        return apiAppointments
            .filter(app => {
                if (isLocalMode && userData.role === 'dentist') {
                    const dentistId = userData.dentist_id || 2;
                    if (app.dentist_id !== dentistId) return false;
                }
                // Hide cancelled appointments from doctor view
                if (app.status === 'cancelled') return false;
                return true;
            })
            .map(app => {
                const startDate = new Date(app.start_time);
                const time = `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`;

                let status: AppointmentStatus = 'in_queue';
                if (app.status === 'completed') status = 'completed';
                else if (app.status === 'cancelled') status = 'cancelled';
                else if (app.status === 'moved') status = 'rescheduled';
                else if (app.status === 'confirmed') status = 'in_progress';
                else if (app.status === 'pending') status = 'in_queue';

                const serviceLabel = app.service === 'implantation' ? t('modal.services.implantation') :
                    app.service === 'hygiene' ? 'Гигиена' :
                        app.service === 'treatment' ? 'Лечение' :
                            app.service === 'extraction' ? 'Удаление' :
                                app.service || t('modal.services.implantation');

                const date = `${startDate.getDate().toString().padStart(2, '0')}.${(startDate.getMonth() + 1).toString().padStart(2, '0')}.${startDate.getFullYear()}`;
                const dateStr = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`;

                const matchingService = services?.find(s => s.name === app.service);
                const price = matchingService?.price;

                return {
                    id: app.id,
                    time,
                    date,
                    dateStr,
                    dateObj: startDate,
                    status,
                    service: serviceLabel,
                    patientName: app.patient_name || 'Пациент',
                    raw: { ...app, price }
                };
            })
            .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
    }, [apiAppointments, t, services]);

    // Effective date: user-selected OR nearest upcoming OR today
    const effectiveDate = useMemo(() => {
        if (selectedDate) return selectedDate;
        if (allAppointmentsData.length === 0) return new Date();
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const upcoming = allAppointmentsData.find(a => {
            const d = new Date(a.dateObj); d.setHours(0, 0, 0, 0);
            return d >= today;
        });
        return upcoming ? upcoming.dateObj : new Date();
    }, [selectedDate, allAppointmentsData]);

    // Filter by effective date
    const appointmentsData = useMemo(() => {
        const selectedDateStr = `${effectiveDate.getFullYear()}-${(effectiveDate.getMonth() + 1).toString().padStart(2, '0')}-${effectiveDate.getDate().toString().padStart(2, '0')}`;
        return allAppointmentsData.filter(a => a.dateStr === selectedDateStr);
    }, [allAppointmentsData, effectiveDate]);

    const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
        if (type === 'success') toast.success(message);
        else if (type === 'error') toast.error(message);
        else if (type === 'warning') toast.warning(message);
        else toast.info(message);
    };

    const handleAptClick = (apt: any) => {
        setSelectedAppointment({
            id: apt.id,
            time: apt.time,
            date: apt.date,
            status: apt.status,
            service: apt.service,
            patientName: apt.patientName,
            raw: apt.raw
        });
        if (apt.status === 'in_progress') {
            setView('in_progress');
        } else {
            setIsDetailOpen(true);
        }
    };

    const day = effectiveDate.getDate();
    const month = t(`common.months.${effectiveDate.getMonth()}`);
    const year = effectiveDate.getFullYear();
    const formattedDate = `${day} ${month}, ${year}`;

    return (
        <div className="p-4 md:p-10 bg-[#f8fbff] min-h-screen relative">
            <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-10">
                {view === 'calendar' ? (
                    <CalendarView onBack={() => setView('list')} />
                ) : view === 'in_progress' ? (
                    <InProgressView
                        appointment={selectedAppointment}
                        onBack={() => setView('list')}
                    />
                ) : (
                    <>
                        {/* Header */}
                        <div className="flex flex-col gap-6">
                            <div className="relative flex items-center h-14">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-4">
                                    <button
                                        onClick={() => navigate(-1)}
                                        className="bg-[#1a1f36] rounded-full p-1 cursor-pointer hover:bg-[#2a2f46] transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5 text-white" />
                                    </button>
                                    <h1 className="text-3xl font-black text-[#1a1f36] tracking-tight">{t('appointments.title')}</h1>
                                </div>
                            </div>

                            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-2">
                                <h2 className="text-3xl md:text-4xl xl:text-5xl font-black text-[#1a1f36] tracking-tight truncate">{formattedDate}</h2>
                                <div className="flex flex-wrap items-center gap-3 md:gap-4 self-start xl:self-auto">
                                    <button
                                        onClick={() => setView('calendar')}
                                        className="flex items-center gap-2 px-5 md:px-8 py-3 bg-white text-[#1a1f36] font-bold rounded-[16px] shadow-sm hover:shadow-md transition-all active:scale-95 text-xs md:text-base cursor-pointer shrink-0"
                                    >
                                        <Calculator className="w-5 h-5 flex-shrink-0" />
                                        <span>{t('appointments.calendar')}</span>
                                    </button>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="px-5 md:px-10 py-3 bg-[#00e396] text-white font-bold rounded-[16px] shadow-lg shadow-[#00e396]/20 hover:bg-[#00d08a] transition-all active:scale-95 text-xs md:text-base cursor-pointer shrink-0"
                                    >
                                        {t('appointments.record_appointment')}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Date Selector */}
                        <DateStrip selectedDate={effectiveDate} onDateChange={setSelectedDate} />

                        {/* Appointments List */}
                        {isLoading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a1f36]" />
                            </div>
                        ) : appointmentsData.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                {appointmentsData.map((apt, idx) => (
                                    <AppointmentCard
                                        key={apt.id || idx}
                                        {...apt}
                                        service={apt.service}
                                        onClick={() => handleAptClick(apt)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-40">
                                <p className="text-gray-400 font-bold text-xl mb-2">Нет записей</p>
                                <p className="text-gray-300 text-sm">На выбранную дату записей нет</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            <AppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => showToast('Приём успешно назначен', 'success')}
            />
            <AppointmentDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                appointment={selectedAppointment}
                onSuccess={showToast}
            />
            {/* Appointments Page Ends */}
        </div>
    );
};

export default Appointments;
