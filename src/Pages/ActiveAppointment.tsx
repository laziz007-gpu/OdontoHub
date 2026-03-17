import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Plus, Paperclip, CalendarPlus, User } from 'lucide-react';
import { useFinishAppointment, useAppointment } from '../api/appointments';
import AddPrescriptionModal from '../components/Patients/AddPrescriptionModal';
import AddAllergyModal from '../components/Patients/AddAllergyModal';
import AddPhotoModal from '../components/Patients/AddPhotoModal';
import AddNoteModal from '../components/Patients/AddNoteModal';

export default function ActiveAppointment() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: appointment, isLoading: isLoadingAppointment } = useAppointment(Number(id));
    const finishMutation = useFinishAppointment();

    const [seconds, setSeconds] = useState(() => {
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
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleFinish = async () => {
        if (!id) return;
        try {
            await finishMutation.mutateAsync(Number(id));
            navigate(-1);
        } catch (error) {
            console.error("Failed to finish appointment", error);
            alert("Ошибка при завершении приёма");
        }
    };

    const handleComingSoon = (feature: string) => {
        alert(`${feature} в разработке`);
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 bg-[#F4F7FE] min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1E2532] hover:bg-gray-100 transition-colors shadow-sm"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-[28px] font-black text-[#1E2532] tracking-wide">
                    {t('appointments.title', 'Приёмы')}
                </h1>
            </div>

            <h2 className="text-[32px] font-black text-[#4F6BFF] mb-6">
                {t('appointments.in_progress', 'В процессе')}
            </h2>

            <div className="flex flex-col gap-6">
                {/* Top Row: Patient Info and Timer */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Patient Info Card */}
                    <div className="md:col-span-5 bg-white rounded-[24px] p-6 shadow-sm flex items-center gap-6">
                        <div className="w-24 h-24 rounded-[20px] bg-gray-100 flex items-center justify-center shrink-0">
                            {appointment?.patient_id || appointment?.patient_name ? (
                                <div className="w-full h-full rounded-[20px] bg-[#4F6BFF] flex items-center justify-center text-white font-black text-2xl">
                                    {(appointment?.patient_name || 'P').charAt(0).toUpperCase()}
                                </div>
                            ) : (
                                <div className="w-full h-full rounded-[20px] bg-gray-100 flex items-center justify-center">
                                    <User className="w-12 h-12 text-gray-400" />
                                </div>
                            )}
                        </div>
                        <div>
                            {isLoadingAppointment ? (
                                <div className="animate-pulse flex flex-col gap-2">
                                    <div className="h-6 w-32 bg-gray-200 rounded"></div>
                                    <div className="h-6 w-24 bg-gray-200 rounded"></div>
                                </div>
                            ) : (
                                <h3 className="text-2xl font-black text-[#1E2532] leading-tight">
                                    {appointment?.patient_name?.split(' ').map((part, i) => (
                                        <React.Fragment key={i}>
                                            {part}<br />
                                        </React.Fragment>
                                    )) || t('appointments.loading', 'Загрузка...')}
                                </h3>
                            )}
                        </div>
                    </div>

                    {/* Timer Card */}
                    <div className="md:col-span-7 bg-white rounded-[24px] p-6 shadow-sm flex items-center justify-center">
                        <div className="text-[56px] font-black text-[#1E2532] tracking-wider tabular-nums">
                            {formatTime(seconds)}
                        </div>
                    </div>
                </div>

                {/* Patient Details Row */}
                {!isLoadingAppointment && appointment && (
                    <div className="bg-white rounded-[24px] p-6 shadow-sm flex flex-wrap gap-x-12 gap-y-4">
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
                )}

                {/* Middle Row: Details Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Prescription */}
                    <div className="bg-white rounded-[24px] p-6 shadow-sm flex flex-col justify-between min-h-[160px] relative">
                        <div>
                            <h3 className="text-xl font-bold text-[#1E2532] mb-3">{t('appointments.prescription', 'Рецепт')}</h3>
                            <div className="flex items-center gap-2 text-[#1E2532] text-sm font-semibold">
                                <div className="w-2 h-2 rounded-full bg-[#1E2532]"></div>
                                {t('appointments.prescription', 'Рецепт')}
                            </div>
                        </div>
                        <button onClick={() => setModals({ ...modals, prescription: true })} className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Notes */}
                    <div className="bg-white rounded-[24px] p-6 shadow-sm flex flex-col justify-between min-h-[160px] relative">
                        <div>
                            <h3 className="text-xl font-bold text-[#FEB019] mb-3">{t('appointments.notes', 'Заметки')}</h3>
                            <div className="flex items-center gap-2 text-[#FEB019] text-sm font-semibold">
                                <div className="w-2 h-2 rounded-full bg-[#FEB019]"></div>
                                {t('appointments.notes', 'Заметки')}
                            </div>
                        </div>
                        <button onClick={() => setModals({ ...modals, note: true })} className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Allergies */}
                    <div className="bg-white rounded-[24px] p-6 shadow-sm flex flex-col justify-between min-h-[160px] relative">
                        <div>
                            <h3 className="text-xl font-bold text-[#FF4545] mb-3">{t('appointments.allergies', 'Аллергии')}</h3>
                            <div className="flex items-center gap-2 text-[#FF4545] text-sm font-semibold">
                                <div className="w-2 h-2 rounded-full bg-[#FF4545]"></div>
                                {t('appointments.allergies', 'Аллергии')}
                            </div>
                        </div>
                        <button onClick={() => setModals({ ...modals, allergy: true })} className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Bottom Row: Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <button onClick={() => setModals({ ...modals, photo: true })} className="lg:col-span-5 bg-[#EAE8E3] rounded-[24px] p-6 shadow-sm flex items-center justify-center min-h-[140px] hover:bg-[#e0ded8] transition-colors group cursor-pointer relative overflow-hidden">
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-[#4F6BFF] flex items-center justify-center text-white">
                                <Paperclip className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-black text-gray-600 group-hover:text-gray-800 transition-colors">
                                {t('appointments.attach_photo', 'Прикрепить фото')}
                            </span>
                        </div>
                    </button>

                    {/* Current Service */}
                    <div className="lg:col-span-4 bg-[#4F6BFF] rounded-[24px] p-6 shadow-sm text-white flex flex-col justify-between min-h-[140px] relative overflow-hidden">
                        <h3 className="text-2xl font-bold relative z-10 mb-4">{appointment?.service || t('appointments.no_service', 'Без услуги')}</h3>
                        <div className="flex justify-between items-end relative z-10 border-t border-white/20 pt-3">
                            <span className="text-lg font-bold">2.500.000 сум</span>
                            <span className="text-sm font-medium opacity-90">{t('appointments.primary', 'Первичный')}</span>
                        </div>
                    </div>

                    <button onClick={() => handleComingSoon('Назначение следующего приёма')} className="lg:col-span-3 bg-[#1DCE5C] rounded-[24px] p-6 shadow-sm text-white flex flex-col items-center justify-center gap-3 min-h-[140px] hover:bg-[#1ab852] transition-colors cursor-pointer">
                        <CalendarPlus className="w-8 h-8" />
                        <span className="text-sm font-bold text-center px-4 leading-tight">
                            {t('appointments.schedule_next', 'Назначить следующий приём')}
                        </span>
                    </button>
                </div>

                {/* Footer Buttons */}
                <div className="flex flex-wrap gap-4 mt-2">
                    <button
                        onClick={handleFinish}
                        disabled={finishMutation.isPending}
                        className="px-8 py-4 bg-[#4F6BFF] text-white text-base font-bold rounded-[16px] shadow-sm hover:bg-blue-700 transition-colors active:scale-95 disabled:opacity-50"
                    >
                        {finishMutation.isPending ? 'Завершение...' : t('appointments.finish', 'Завершить')}
                    </button>
                    <button
                        onClick={() => handleComingSoon('Добавление оплаты')}
                        className="px-8 py-4 bg-[#1DCE5C] text-white text-base font-bold rounded-[16px] shadow-sm hover:bg-green-500 transition-colors active:scale-95"
                    >
                        {t('appointments.add_payment', 'Добавить оплату')}
                    </button>
                    <button
                        onClick={() => handleComingSoon('Добавление услуги')}
                        className="px-8 py-4 bg-[#FEB019] text-white text-base font-bold rounded-[16px] shadow-sm hover:bg-yellow-500 transition-colors active:scale-95"
                    >
                        {t('appointments.add_service', 'Добавить услугу')}
                    </button>
                </div>
            </div>

            {/* Modals */}
            {modals.prescription && (
                <AddPrescriptionModal
                    patientId={appointment?.patient_id || 0}
                    onClose={() => setModals({ ...modals, prescription: false })}
                    onSuccess={() => setModals({ ...modals, prescription: false })}
                />
            )}

            {modals.allergy && (
                <AddAllergyModal
                    patientId={appointment?.patient_id || 0}
                    onClose={() => setModals({ ...modals, allergy: false })}
                    onSuccess={() => setModals({ ...modals, allergy: false })}
                />
            )}

            {modals.note && (
                <AddNoteModal
                    isOpen={modals.note}
                    patientId={appointment?.patient_id || 0}
                    onClose={() => setModals({ ...modals, note: false })}
                    onSuccess={() => setModals({ ...modals, note: false })}
                />
            )}

            {modals.photo && (
                <AddPhotoModal
                    patientId={appointment?.patient_id || 0}
                    onClose={() => setModals({ ...modals, photo: false })}
                    onSuccess={() => setModals({ ...modals, photo: false })}
                />
            )}
        </div>
    );
}
