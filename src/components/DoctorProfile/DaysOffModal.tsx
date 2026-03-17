import { type FC, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Plus, CalendarRange } from 'lucide-react';

interface DaysOffModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { dates: string[]; reason?: string }) => void;
}

const DaysOffModal: FC<DaysOffModalProps> = ({ isOpen, onClose, onSave }) => {
    const { t } = useTranslation();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRangeMode, setIsRangeMode] = useState(false);

    // Refs for date inputs
    const startDateRef = useRef<HTMLInputElement>(null);
    const endDateRef = useRef<HTMLInputElement>(null);
    const singleDateRef = useRef<HTMLInputElement>(null);


    const generateDateRange = (start: string, end: string): string[] => {
        const dates: string[] = [];
        const startDateObj = new Date(start);
        const endDateObj = new Date(end);

        const currentDate = new Date(startDateObj);
        while (currentDate <= endDateObj) {
            dates.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dates;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let dates: string[] = [];

        if (isRangeMode) {
            if (!startDate || !endDate) return;
            dates = generateDateRange(startDate, endDate);
        } else {
            if (!startDate) return;
            dates = [startDate];
        }

        setIsLoading(true);
        try {
            await onSave({ dates, reason: reason || undefined });
            setStartDate('');
            setEndDate('');
            setReason('');
            onClose();
        } catch (error) {
            console.error('Error adding days off:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setStartDate('');
        setEndDate('');
        setReason('');
        setIsRangeMode(false);
        onClose();
    };

    if (!isOpen) return null;

    // Получаем сегодняшнюю дату для минимального значения
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-[#1E2532]">
                        {t('doctor_profile.add_day_off', 'Dam olish kuni qo\'shish')}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Mode Toggle */}
                    <div className="flex bg-gray-100 rounded-[20px] p-1">
                        <button
                            type="button"
                            onClick={() => setIsRangeMode(false)}
                            className={`flex-1 py-3 px-4 rounded-[16px] font-bold text-sm transition-all flex items-center justify-center gap-2 ${!isRangeMode
                                ? 'bg-white text-[#1E2532] shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <div className="w-4 h-4 bg-current rounded-sm"></div>
                            {t('doctor_profile.single_day', 'Bir kun')}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsRangeMode(true)}
                            className={`flex-1 py-3 px-4 rounded-[16px] font-bold text-sm transition-all flex items-center justify-center gap-2 ${isRangeMode
                                ? 'bg-white text-[#1E2532] shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <CalendarRange className="w-4 h-4" />
                            {t('doctor_profile.date_range', 'Oraliq')}
                        </button>
                    </div>

                    {/* Date Selection */}
                    {isRangeMode ? (
                        <div className="space-y-4">
                            {/* Start Date */}
                            <div>
                                <label className="block text-sm font-bold text-[#1E2532] mb-3">
                                    {t('doctor_profile.start_date', 'Boshlanish sanasi')}
                                </label>
                                <div className="relative cursor-pointer">
                                    <input
                                        ref={startDateRef}
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => {
                                            setStartDate(e.target.value);
                                            // Если конечная дата раньше начальной, сбрасываем её
                                            if (endDate && e.target.value > endDate) {
                                                setEndDate('');
                                            }
                                        }}
                                        onClick={(e) => ('showPicker' in HTMLInputElement.prototype) && e.currentTarget.showPicker()}
                                        min={today}
                                        required
                                        className="w-full h-14 bg-[#F5F7FA] border border-gray-200 rounded-[20px] px-4 text-lg font-semibold focus:outline-none focus:border-blue-400 focus:bg-white hover:bg-white hover:border-blue-300 transition-all cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* End Date */}
                            <div>
                                <label className="block text-sm font-bold text-[#1E2532] mb-3">
                                    {t('doctor_profile.end_date', 'Tugash sanasi')}
                                </label>
                                <div className="relative cursor-pointer">
                                    <input
                                        ref={endDateRef}
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        onClick={(e) => ('showPicker' in HTMLInputElement.prototype) && e.currentTarget.showPicker()}
                                        min={startDate || today}
                                        required
                                        className="w-full h-14 bg-[#F5F7FA] border border-gray-200 rounded-[20px] px-4 text-lg font-semibold focus:outline-none focus:border-blue-400 focus:bg-white hover:bg-white hover:border-blue-300 transition-all cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Date Range Preview */}
                            {startDate && endDate && (
                                <div className="bg-blue-50 border border-blue-200 rounded-[16px] p-4">
                                    <div className="text-sm font-bold text-blue-800 mb-1">
                                        {t('doctor_profile.selected_period', 'Tanlangan davr')}:
                                    </div>
                                    <div className="text-blue-700">
                                        {new Date(startDate).toLocaleDateString('uz-UZ')} - {new Date(endDate).toLocaleDateString('uz-UZ')}
                                    </div>
                                    <div className="text-xs text-blue-600 mt-1">
                                        {generateDateRange(startDate, endDate).length} {t('doctor_profile.days', 'kun')}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-bold text-[#1E2532] mb-3">
                                {t('doctor_profile.select_date', 'Sanani tanlang')}
                            </label>
                            <div className="relative cursor-pointer">
                                <input
                                    ref={singleDateRef}
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    onClick={(e) => ('showPicker' in HTMLInputElement.prototype) && e.currentTarget.showPicker()}
                                    min={today}
                                    required
                                    className="w-full h-14 bg-[#F5F7FA] border border-gray-200 rounded-[20px] px-4 text-lg font-semibold focus:outline-none focus:border-blue-400 focus:bg-white hover:bg-white hover:border-blue-300 transition-all cursor-pointer"
                                />
                            </div>
                        </div>
                    )}

                    {/* Reason */}
                    <div>
                        <label className="block text-sm font-bold text-[#1E2532] mb-3">
                            {t('doctor_profile.reason', 'Sabab')} ({t('common.optional', 'ixtiyoriy')})
                        </label>
                        <input
                            type="text"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder={t('doctor_profile.reason_placeholder', 'Masalan: Tog\'larga sayohat, shaxsiy ishlar')}
                            className="w-full h-14 bg-[#F5F7FA] border border-gray-200 rounded-[20px] px-4 text-lg font-semibold focus:outline-none focus:border-blue-400 focus:bg-white hover:bg-white hover:border-blue-300 transition-all placeholder:text-gray-400 cursor-text"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 h-14 bg-gray-100 text-gray-600 rounded-[20px] font-bold hover:bg-gray-200 transition-colors"
                        >
                            {t('common.cancel', 'Bekor qilish')}
                        </button>
                        <button
                            type="submit"
                            disabled={(!startDate || (isRangeMode && !endDate)) || isLoading}
                            className="flex-1 h-14 bg-[#5B7FFF] text-white rounded-[20px] font-bold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Plus className="w-4 h-4" />
                                    {t('common.add', 'Qo\'shish')}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DaysOffModal;