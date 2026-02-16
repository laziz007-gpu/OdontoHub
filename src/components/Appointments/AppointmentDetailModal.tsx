import React from 'react';
import { useTranslation } from 'react-i18next';
import { type AppointmentStatus } from './AppointmentCard';

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
        raw: any;
    } | null;
}

const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({ isOpen, onClose, appointment }) => {
    const { t } = useTranslation();

    if (!isOpen || !appointment) return null;

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
                className="bg-white w-full max-w-[400px] h-full shadow-2xl animate-in slide-in-from-right duration-300 p-8 flex flex-col"
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
                        <div className="pt-4 border-t border-white/20">
                            <span className="text-2xl font-black">2.500.000 <span className="text-sm">сум</span></span>
                        </div>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="w-full py-5 bg-[#4f6bff] text-white text-xl font-black rounded-[20px] shadow-lg shadow-[#4f6bff]/30 hover:bg-[#3d56ff] transition-all active:scale-[0.98] mt-8"
                >
                    {t('common.close')}
                </button>
            </div>
        </div>
    );
};

export default AppointmentDetailModal;
