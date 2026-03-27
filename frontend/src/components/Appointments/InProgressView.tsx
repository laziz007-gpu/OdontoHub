import React from 'react';
import { ChevronLeft, Paperclip, Plus, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface InProgressViewProps {
    onBack: () => void;
    appointment: {
        patientName: string;
        service: string;
        [key: string]: any;
    } | null;
}

const InProgressView: React.FC<InProgressViewProps> = ({ onBack, appointment }) => {
    const { t } = useTranslation();

    if (!appointment) return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Top Row */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm flex items-center gap-6">
                    <div className="w-32 h-32 bg-[#e0e0e0] rounded-[24px] shrink-0"></div>
                    <div>
                        <h3 className="text-3xl font-black text-[#1a1f36] leading-tight">
                            {appointment.patientName}
                        </h3>
                    </div>
                </div>

                {/* Right Column: Timer */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm flex items-center justify-center">
                    <div className="flex items-center gap-4 text-6xl md:text-7xl font-black text-[#1a1f36]">
                        <span>01</span>
                        <span className="opacity-30">:</span>
                        <span>20</span>
                        <span className="opacity-30">:</span>
                        <span className="text-[#4f6bff]">54</span>
                    </div>
                </div>

                {/* Second Row: Medical Cards */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Recipe Card */}
                    <div className="bg-white rounded-[32px] p-8 shadow-sm relative group min-h-[220px]">
                        <h4 className="text-2xl font-black text-[#1a1f36] mb-4">{t('appointments.progress.recipe')}</h4>
                        <div className="flex items-center gap-3 text-lg font-bold text-[#1a1f36]">
                            <div className="w-2 h-2 bg-[#1a1f36] rounded-full"></div>
                            <span>{t('appointments.progress.recipe')}</span>
                        </div>
                        <button className="absolute bottom-6 right-6 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#4f6bff] hover:text-white transition-all cursor-pointer">
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Notes Card */}
                    <div className="bg-white rounded-[32px] p-8 shadow-sm relative group min-h-[220px]">
                        <h4 className="text-2xl font-black text-[#fdbc31] mb-4">{t('appointments.progress.notes')}</h4>
                        <div className="flex items-center gap-3 text-lg font-bold text-[#1a1f36]">
                            <div className="w-2 h-2 bg-[#fdbc31] rounded-full"></div>
                            <span>{t('appointments.progress.notes')}</span>
                        </div>
                        <button className="absolute bottom-6 right-6 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#4f6bff] hover:text-white transition-all cursor-pointer">
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Allergies Card */}
                    <div className="bg-white rounded-[32px] p-8 shadow-sm relative group min-h-[220px]">
                        <h4 className="text-2xl font-black text-[#ff3b30] mb-4">{t('appointments.progress.allergies')}</h4>
                        <div className="flex items-center gap-3 text-lg font-bold text-[#1a1f36]">
                            <div className="w-2 h-2 bg-[#ff3b30] rounded-full"></div>
                            <span>{t('appointments.progress.allergies')}</span>
                        </div>
                        <button className="absolute bottom-6 right-6 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#4f6bff] hover:text-white transition-all cursor-pointer">
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Third Row: Media & Service */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                    {/* Add Photo */}
                    <div className="md:col-span-5 bg-[#e9ebf0] rounded-[32px] p-10 flex items-center justify-center gap-4 cursor-pointer hover:bg-gray-200 transition-colors">
                        <Paperclip className="w-8 h-8 text-[#1a1f36]" />
                        <span className="text-2xl font-black text-[#1a1f36] underline">
                            {t('appointments.progress.attach_photo')}
                        </span>
                    </div>

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
                    <button className="md:col-span-3 bg-[#10d16d] rounded-[32px] p-8 text-white flex flex-col items-center justify-center gap-4 hover:bg-[#0eca69] transition-all active:scale-[0.98] shadow-lg shadow-[#10d16d]/20 cursor-pointer text-center">
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
                    onClick={onBack}
                    className="flex-1 min-w-[200px] h-16 bg-[#5377f7] text-white text-xl font-black rounded-3xl shadow-lg shadow-[#5377f7]/20 hover:bg-[#4669eb] transition-all active:scale-[0.98] cursor-pointer"
                >
                    {t('appointments.progress.finish')}
                </button>
                <button
                    className="flex-1 min-w-[200px] h-16 bg-[#10d16d] text-white text-xl font-black rounded-3xl shadow-lg shadow-[#10d16d]/20 hover:bg-[#0eca69] transition-all active:scale-[0.98] cursor-pointer"
                >
                    {t('appointments.progress.add_payment')}
                </button>
            </div>
        </div>
    );
};

export default InProgressView;
