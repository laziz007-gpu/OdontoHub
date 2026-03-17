import React, { useState, useEffect } from 'react';
import { ChevronLeft, Paperclip, Plus, Clock, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFinishAppointment } from '../../api/appointments';
import AddPrescriptionModal from '../Patients/AddPrescriptionModal';
import AddAllergyModal from '../Patients/AddAllergyModal';
import AddPhotoModal from '../Patients/AddPhotoModal';
import AddNoteModal from '../Patients/AddNoteModal';

interface InProgressViewProps {
    onBack: () => void;
    appointment: {
        id: number;
        patientName: string;
        service: string;
        raw: any;
        [key: string]: any;
    } | null;
}

const InProgressView: React.FC<InProgressViewProps> = ({ onBack, appointment }) => {
    const { t } = useTranslation();
    const finishMutation = useFinishAppointment();
    const id = appointment?.id;

    const [seconds, setSeconds] = useState(() => {
        if (!id) return 0;
        const saved = localStorage.getItem(`timer_${id}`);
        if (saved) {
            const { startTime, lastSeconds } = JSON.parse(saved);
            const now = Date.now();
            return lastSeconds + Math.floor((now - startTime) / 1000);
        }
        return 0;
    });

    const [modals, setModals] = useState({
        prescription: false,
        allergy: false,
        note: false,
        photo: false
    });

    useEffect(() => {
        if (!id) return;
        const timer = setInterval(() => {
            setSeconds((prev: number) => {
                const next = prev + 1;
                localStorage.setItem(`timer_${id}`, JSON.stringify({
                    startTime: Date.now(),
                    lastSeconds: next
                }));
                return next;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [id]);

    const formatTime = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return {
            h: h.toString().padStart(2, '0'),
            m: m.toString().padStart(2, '0'),
            s: s.toString().padStart(2, '0')
        };
    };

    const handleFinish = async () => {
        if (!id) return;
        try {
            await finishMutation.mutateAsync(id);
            onBack();
        } catch (error) {
            console.error("Failed to finish appointment", error);
            alert("Ошибка при завершении приёма");
        }
    };

    if (!appointment) return null;

    const time = formatTime(seconds);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="bg-[#1a1f36] rounded-full p-1 cursor-pointer hover:bg-[#2a2f46] transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <h1 className="text-3xl font-black text-[#1a1f36] tracking-tight">
                        {t('appointments.title')}
                    </h1>
                </div>
                <h2 className="text-4xl lg:text-5xl font-extrabold text-[#4f6bff] tracking-tight">
                    {t('appointments.statuses.in_progress')}
                </h2>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Patient Info Row */}
                <div className="lg:col-span-5 bg-white rounded-[32px] p-8 shadow-sm flex items-center gap-6">
                    <div className="w-24 h-24 rounded-[20px] bg-[#4F6BFF] flex items-center justify-center text-white font-black text-3xl shrink-0">
                        {appointment.patientName?.charAt(0).toUpperCase() || <User className="w-12 h-12" />}
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-[#1a1f36] leading-tight">
                            {appointment.patientName?.split(' ').map((part, i) => (
                                <React.Fragment key={i}>
                                    {part}<br />
                                </React.Fragment>
                            ))}
                        </h3>
                    </div>
                </div>

                {/* Right Column: Timer */}
                <div className="lg:col-span-7 bg-white rounded-[32px] p-8 shadow-sm flex items-center justify-center">
                    <div className="flex items-center gap-4 text-6xl md:text-7xl font-black text-[#1a1f36] tabular-nums">
                        <span>{time.h}</span>
                        <span className="opacity-30">:</span>
                        <span>{time.m}</span>
                        <span className="opacity-30">:</span>
                        <span className="text-[#4f6bff]">{time.s}</span>
                    </div>
                </div>

                {/* Patient Details Row */}
                <div className="lg:col-span-12 bg-white rounded-[32px] p-8 shadow-sm flex flex-wrap gap-x-12 gap-y-4">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                            {t('patient.status', 'СТАТУС')}
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#1DCE5C]"></div>
                            <span className="text-sm font-black text-[#1E2532]">ЛЕЧИТСЯ</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                            {t('patient.age', 'ВОЗРАСТ')}
                        </p>
                        <p className="text-sm font-black text-[#1E2532]">24 года</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                            {t('patient.gender', 'ПОЛ')}
                        </p>
                        <p className="text-sm font-black text-[#1E2532]">Мужской</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                            {t('patient.phone', 'НОМЕР ТЕЛЕФОНА')}
                        </p>
                        <p className="text-sm font-black text-[#1E2532]">+998 90 123 45 67</p>
                    </div>
                </div>

                {/* Second Row: Medical Cards */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Recipe Card */}
                    <div className="bg-white rounded-[32px] p-8 shadow-sm relative group min-h-[200px]">
                        <h4 className="text-2xl font-black text-[#1a1f36] mb-4">{t('appointments.progress.recipe')}</h4>
                        <div className="flex items-center gap-3 text-lg font-bold text-[#1a1f36]">
                            <div className="w-2 h-2 bg-[#1a1f36] rounded-full"></div>
                            <span>{t('appointments.progress.recipe')}</span>
                        </div>
                        <button
                            onClick={() => setModals({ ...modals, prescription: true })}
                            className="absolute bottom-6 right-6 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#4f6bff] hover:text-white transition-all cursor-pointer"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Notes Card */}
                    <div className="bg-white rounded-[32px] p-8 shadow-sm relative group min-h-[200px]">
                        <h4 className="text-2xl font-black text-[#fdbc31] mb-4">{t('appointments.progress.notes')}</h4>
                        <div className="flex items-center gap-3 text-lg font-bold text-[#1a1f36]">
                            <div className="w-2 h-2 bg-[#fdbc31] rounded-full"></div>
                            <span>{t('appointments.progress.notes')}</span>
                        </div>
                        <button
                            onClick={() => setModals({ ...modals, note: true })}
                            className="absolute bottom-6 right-6 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#4f6bff] hover:text-white transition-all cursor-pointer"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Allergies Card */}
                    <div className="bg-white rounded-[32px] p-8 shadow-sm relative group min-h-[200px]">
                        <h4 className="text-2xl font-black text-[#ff3b30] mb-4">{t('appointments.progress.allergies')}</h4>
                        <div className="flex items-center gap-3 text-lg font-bold text-[#1a1f36]">
                            <div className="w-2 h-2 bg-[#ff3b30] rounded-full"></div>
                            <span>{t('appointments.progress.allergies')}</span>
                        </div>
                        <button
                            onClick={() => setModals({ ...modals, allergy: true })}
                            className="absolute bottom-6 right-6 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#4f6bff] hover:text-white transition-all cursor-pointer"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Third Row: Media & Service */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                    {/* Add Photo */}
                    <button
                        onClick={() => setModals({ ...modals, photo: true })}
                        className="md:col-span-5 bg-[#e9ebf0] rounded-[32px] p-10 flex items-center justify-center gap-4 cursor-pointer hover:bg-gray-200 transition-colors border-none text-left"
                    >
                        <div className="p-3 bg-white rounded-xl shadow-sm">
                            <Paperclip className="w-8 h-8 text-[#4f6bff]" />
                        </div>
                        <span className="text-2xl font-black text-[#1a1f36] underline">
                            {t('appointments.progress.attach_photo')}
                        </span>
                    </button>

                    {/* Service Detail */}
                    <div className="md:col-span-4 bg-[#5377f7] rounded-[32px] p-8 text-white flex flex-col justify-between min-h-[160px]">
                        <div className="flex justify-between items-start">
                            <h3 className="text-2xl font-black">{appointment.service}</h3>
                        </div>
                        <div className="pt-4 border-t border-white/20 flex justify-between items-end">
                            <span className="text-2xl font-black">2.500.000 <span className="text-sm">сум</span></span>
                            <span className="text-[12px] font-bold opacity-70 italic">{t('appointments.detail.initial')}</span>
                        </div>
                    </div>

                    {/* Next Appointment Button */}
                    <button
                        onClick={() => alert('Назначение следующего приёма в разработке')}
                        className="md:col-span-3 bg-[#10d16d] rounded-[32px] p-8 text-white flex flex-col items-center justify-center gap-4 hover:bg-[#0eca69] transition-all active:scale-[0.98] shadow-lg shadow-[#10d16d]/20 cursor-pointer text-center"
                    >
                        <div className="p-3 bg-white/20 rounded-xl">
                            <Clock className="w-8 h-8" />
                        </div>
                        <span className="text-lg font-black leading-tight">
                            {t('appointments.progress.schedule_next')}
                        </span>
                    </button>
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
                <button
                    onClick={handleFinish}
                    disabled={finishMutation.isPending}
                    className="flex-1 min-w-[200px] h-16 bg-[#5377f7] text-white text-xl font-black rounded-3xl shadow-lg shadow-[#5377f7]/20 hover:bg-[#4669eb] transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                    {finishMutation.isPending ? 'Завершение...' : t('appointments.progress.finish')}
                </button>
                <button
                    onClick={() => alert('Добавление оплаты в разработке')}
                    className="flex-1 min-w-[200px] h-16 bg-[#10d16d] text-white text-xl font-black rounded-3xl shadow-lg shadow-[#10d16d]/20 hover:bg-[#0eca69] transition-all active:scale-[0.98] cursor-pointer"
                >
                    {t('appointments.progress.add_payment')}
                </button>
            </div>

            {/* Modals */}
            {modals.prescription && (
                <AddPrescriptionModal
                    patientId={appointment.raw?.patient_id || 0}
                    onClose={() => setModals({ ...modals, prescription: false })}
                    onSuccess={() => setModals({ ...modals, prescription: false })}
                />
            )}

            {modals.allergy && (
                <AddAllergyModal
                    patientId={appointment.raw?.patient_id || 0}
                    onClose={() => setModals({ ...modals, allergy: false })}
                    onSuccess={() => setModals({ ...modals, allergy: false })}
                />
            )}

            {modals.note && (
                <AddNoteModal
                    isOpen={modals.note}
                    patientId={appointment.raw?.patient_id || 0}
                    onClose={() => setModals({ ...modals, note: false })}
                    onSuccess={() => setModals({ ...modals, note: false })}
                />
            )}

            {modals.photo && (
                <AddPhotoModal
                    patientId={appointment.raw?.patient_id || 0}
                    onClose={() => setModals({ ...modals, photo: false })}
                    onSuccess={() => setModals({ ...modals, photo: false })}
                />
            )}
        </div>
    );
};

export default InProgressView;
