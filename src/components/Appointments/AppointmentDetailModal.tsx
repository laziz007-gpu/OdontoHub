import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { type AppointmentStatus } from './AppointmentCard';
import { useCancelAppointment, useRescheduleAppointment, useStartAppointment } from '../../api/appointments';
import RescheduleModal from './RescheduleModal';
import { useNavigate } from 'react-router-dom';

interface AppointmentDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointment: {
        id: number;
        time: string;
        date: string;
        service: string;
        patientName: string;
        status: AppointmentStatus;
        raw?: any;
    } | null;
    onSuccess?: (message: string, type: 'success' | 'error') => void;
}

const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({ isOpen, onClose, appointment, onSuccess }) => {
    // Triggers HMR for missing export
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
    const cancelMutation = useCancelAppointment();
    const rescheduleMutation = useRescheduleAppointment();
    const startMutation = useStartAppointment();

    if (!isOpen || !appointment) return null;

    const handleStart = async () => {
        if (!appointment) return;

        try {
            if (appointment.status !== 'in_progress') {
                await startMutation.mutateAsync(appointment.id);
            }
            onClose();
            navigate(`/appointments/active/${appointment.id}`);
        } catch (error) {
            onSuccess?.('Ошибка при начале приёма', 'error');
        }
    };

    const handleCancel = async () => {
        if (confirm('Вы уверены что хотите отменить этот приём?')) {
            try {
                await cancelMutation.mutateAsync(appointment.id);
                onSuccess?.('Приём успешно отменён', 'success');
                onClose();
            } catch (error) {
                onSuccess?.('Ошибка при отмене приёма', 'error');
            }
        }
    };

    const handleReschedule = async (startTime: string, endTime: string) => {
        try {
            await rescheduleMutation.mutateAsync({
                appointmentId: appointment.id,
                start_time: startTime,
                end_time: endTime
            });
            onSuccess?.('Приём успешно перенесён', 'success');
            setIsRescheduleOpen(false);
            onClose();
        } catch (error) {
            onSuccess?.('Ошибка при переносе приёма', 'error');
        }
    };

    const statusColors: Record<AppointmentStatus, string> = {
        'completed': 'text-[#10d16d]',
        'cancelled': 'text-[#ff4560]',
        'rescheduled': 'text-[#feb019]',
        'in_progress': 'text-[#4f6bff]',
        'in_queue': 'text-[#6c757d]',
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-[400px] h-full shadow-2xl animate-in slide-in-from-right duration-300 p-8 flex flex-col overflow-y-auto"
            >
                {/* Image Placeholder */}
                <div className="w-full aspect-video bg-[#e0e0e0] rounded-[24px] mb-8"></div>

                {/* Patient Info */}
                <div className="space-y-6 flex-1">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 font-bold">{t('appointments.detail.patient')}</span>
                        <span className="text-[#1a1f36] text-xl font-black">{appointment.patientName}</span>
                    </div>

                    <div className="space-y-4 pt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 font-bold">{t('appointments.detail.time')}</span>
                            <span className="text-[#1a1f36] text-xl font-black">{appointment.time}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 font-bold">{t('appointments.detail.date')}</span>
                            <span className="text-[#1a1f36] text-xl font-black">{appointment.date || '—'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 font-bold">{t('appointments.detail.status')}</span>
                            <span className={`text-xl font-black ${statusColors[appointment.status]}`}>
                                {t(`appointments.statuses.${appointment.status}`)}
                            </span>
                        </div>
                    </div>

                    {appointment.raw?.notes && (
                        <div className="pt-4 border-t border-gray-100">
                            <span className="text-gray-500 font-bold block mb-2">Заметки:</span>
                            <p className="text-[#1a1f36] font-medium italic">{appointment.raw.notes}</p>
                        </div>
                    )}

                    {/* Service Box */}
                    <div className="mt-10 bg-[#4f6bff] rounded-[20px] p-6 text-white space-y-4">
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-black">{appointment.service}</h3>
                            <span className="text-[12px] font-bold bg-white/20 px-3 py-1 rounded-full">
                                {t('appointments.detail.initial')}
                            </span>
                        </div>
                        {appointment.raw?.price && (
                            <div className="pt-4 border-t border-white/20">
                                <span className="text-2xl font-black">{appointment.raw.price.toLocaleString()} <span className="text-sm">сум</span></span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Close Button */}
                <div className="flex flex-wrap gap-3 mt-8">
                    <button
                        onClick={onClose}
                        className="flex-1 min-w-[100px] py-4 bg-gray-100 text-gray-600 text-base md:text-lg font-black rounded-[20px] hover:bg-gray-200 transition-all active:scale-[0.98]"
                    >
                        {t('common.close', 'Закрыть')}
                    </button>
                    {appointment.status !== 'cancelled' && appointment.status !== 'completed' && appointment.status !== 'in_progress' && (
                        <>
                            <button
                                onClick={handleStart}
                                disabled={startMutation.isPending}
                                className="flex-1 min-w-[140px] py-4 bg-[#4f6bff] text-white text-base md:text-lg font-black rounded-[20px] shadow-lg shadow-[#4f6bff]/30 hover:bg-[#3d56d5] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {startMutation.isPending && <Loader2 className="w-5 h-5 animate-spin" />}
                                Начать
                            </button>
                            <button
                                onClick={() => setIsRescheduleOpen(true)}
                                className="flex-1 min-w-[100px] py-4 bg-[#feb019] text-white text-base md:text-lg font-black rounded-[20px] shadow-lg shadow-[#feb019]/30 hover:bg-[#e09d15] transition-all active:scale-[0.98]"
                            >
                                Перенести
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex-1 min-w-[100px] py-4 bg-[#ff4560] text-white text-base md:text-lg font-black rounded-[20px] shadow-lg shadow-[#ff4560]/30 hover:bg-[#e03d54] transition-all active:scale-[0.98]"
                            >
                                Отменить
                            </button>
                        </>
                    )}
                    {appointment.status === 'in_progress' && (
                        <button
                            onClick={handleStart}
                            className="flex-[2] py-4 bg-[#4f6bff] text-white text-base md:text-lg font-black rounded-[20px] shadow-lg shadow-[#4f6bff]/30 hover:bg-[#3d56d5] transition-all active:scale-[0.98]"
                        >
                            Продолжить приём
                        </button>
                    )}
                </div>
            </div>

            {/* Reschedule Modal */}
            {appointment.raw?.start_time && (
                <RescheduleModal
                    isOpen={isRescheduleOpen}
                    onClose={() => setIsRescheduleOpen(false)}
                    onConfirm={handleReschedule}
                    currentStartTime={appointment.raw.start_time}
                />
            )}
        </div>
    );
};

export default AppointmentDetailModal;
