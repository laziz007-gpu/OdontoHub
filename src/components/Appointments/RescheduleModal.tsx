import React, { useState } from 'react';
import { X, Calendar, Clock } from 'lucide-react';

interface RescheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (startTime: string, endTime: string) => void;
    currentStartTime: string;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    currentStartTime
}) => {
    const currentDate = new Date(currentStartTime);
    const [date, setDate] = useState(currentDate.toISOString().split('T')[0]);
    const [time, setTime] = useState(
        `${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`
    );

    if (!isOpen) return null;

    const handleConfirm = () => {
        const [hours, minutes] = time.split(':');
        const startDateTime = new Date(date);
        startDateTime.setHours(parseInt(hours), parseInt(minutes), 0);

        const endDateTime = new Date(startDateTime);
        endDateTime.setHours(startDateTime.getHours() + 1);

        // Format explicitly to local ISO without shifting to UTC
        const formatLocalISO = (d: Date) => {
            const pad = (n: number) => n.toString().padStart(2, '0');
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
        };

        onConfirm(formatLocalISO(startDateTime), formatLocalISO(endDateTime));
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-md animate-in fade-in duration-300"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-[480px] rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/40 p-8 md:p-10 transform animate-in zoom-in-95 duration-300"
            >
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-black text-[#1a1f36] tracking-tight">Перенос приёма</h2>
                        <p className="text-gray-400 font-bold mt-1 text-sm">Выберите новое время визита</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-[#1a1f36] hover:bg-gray-100 rounded-2xl transition-all duration-300 group"
                    >
                        <X className="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                <div className="space-y-8">
                    <div className="group">
                        <label className="block text-sm font-black text-[#1a1f36] mb-3 ml-1 uppercase tracking-wider opacity-60">Дата приёма</label>
                        <div className="relative">
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                onClick={(e) => {
                                    try {
                                        // @ts-ignore
                                        e.currentTarget.showPicker();
                                    } catch (err) {
                                        e.currentTarget.focus();
                                    }
                                }}
                                className="w-full pl-14 pr-6 py-5 bg-[#f8f9fc] border-2 border-transparent rounded-[24px] focus:bg-white focus:border-[#4f6bff] focus:shadow-[0_0_0_8px_rgba(79,107,255,0.05)] transition-all outline-none font-bold text-[#1a1f36] text-lg cursor-pointer appearance-none"
                            />
                            <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-[#4f6bff] transition-colors" />
                        </div>
                    </div>

                    <div className="group">
                        <label className="block text-sm font-black text-[#1a1f36] mb-3 ml-1 uppercase tracking-wider opacity-60">Время начала</label>
                        <div className="relative">
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                onClick={(e) => {
                                    try {
                                        // @ts-ignore
                                        e.currentTarget.showPicker();
                                    } catch (err) {
                                        e.currentTarget.focus();
                                    }
                                }}
                                className="w-full pl-14 pr-6 py-5 bg-[#f8f9fc] border-2 border-transparent rounded-[24px] focus:bg-white focus:border-[#4f6bff] focus:shadow-[0_0_0_8px_rgba(79,107,255,0.05)] transition-all outline-none font-bold text-[#1a1f36] text-lg cursor-pointer appearance-none"
                            />
                            <Clock className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-[#4f6bff] transition-colors" />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                        <button
                            onClick={onClose}
                            className="flex-1 h-[68px] px-8 bg-gray-50 text-gray-500 font-bold rounded-[24px] hover:bg-gray-100 hover:text-[#1a1f36] transition-all duration-300"
                        >
                            Отмена
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-[1.5] h-[68px] px-8 bg-[#feb019] text-white font-black text-xl rounded-[24px] shadow-[0_10px_25px_rgba(254,176,25,0.3)] hover:shadow-[0_15px_30px_rgba(254,176,25,0.4)] hover:-translate-y-1 transition-all duration-300 active:translate-y-0 active:shadow-none"
                        >
                            Перенести
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RescheduleModal;

