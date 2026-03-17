import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import { useDaysOff, useDeleteDayOff } from '../../api/daysOff';
import { useCurrentUser } from '../../api/auth';

interface ScheduleCardProps {
    schedule?: string;
    workStart?: string;
    startMinute?: string;
    workEnd?: string;
    endMinute?: string;
    onSave?: (newData: any) => void;
    onAddDayOff?: () => void;
}

const ScheduleCard: FC<ScheduleCardProps> = ({
    schedule,
    workStart = '08',
    startMinute = '00',
    workEnd = '16',
    endMinute = '00',
    onSave,
    onAddDayOff
}) => {
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const minutes = ['00', '15', '30', '45'];

    // Получаем информацию о текущем пользователе
    const { data: currentUser, isLoading: userLoading, error: userError } = useCurrentUser();

    // Получаем выходные дни (ближайшие 30 дней)
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 30);
    
    const { data: daysOff = [], refetch, isLoading, error } = useDaysOff(
        today.toISOString().split('T')[0],
        futureDate.toISOString().split('T')[0]
    );
    
    // Отладочная информация
    console.log('=== SCHEDULE CARD DEBUG ===');
    console.log('Current user:', currentUser);
    console.log('User loading:', userLoading);
    console.log('User error:', userError);
    console.log('Days off data:', daysOff);
    console.log('Days off loading:', isLoading);
    console.log('Days off error:', error);
    console.log('API URL being called:', `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/days-off/`);
    console.log('Date range:', { startDate: today.toISOString().split('T')[0], endDate: futureDate.toISOString().split('T')[0] });
    console.log('Access token:', localStorage.getItem('access_token') ? 'Present' : 'Missing');
    console.log('User role:', localStorage.getItem('role'));
    console.log('=== END DEBUG ===');
    
    const deleteDayOff = useDeleteDayOff();

    const handleDeleteDayOff = async (dayOffId: number) => {
        try {
            await deleteDayOff.mutateAsync(dayOffId);
            refetch();
        } catch (error) {
            console.error('Error deleting day off:', error);
        }
    };

    const handleSave = (field: string, value: string) => {
        if (onSave) {
            onSave({ [field]: value });
        }
    };

    return (
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50 h-full">
            <h3 className="text-2xl font-bold text-[#1E2532] mb-8">{t('doctor_profile.schedule')}</h3>

            <div className="space-y-8">
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-[#1E2532] text-sm">{schedule || t('doctor_profile.every_day')}</span>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="flex-1 bg-[#F5F7FA] py-4 rounded-[20px] px-6 flex items-center justify-between border border-gray-100 transition-all hover:border-blue-200">
                            {isEditing ? (
                                <div className="flex items-center gap-2 w-full justify-center">
                                    {/* Start Time */}
                                    <div className="flex items-center gap-1">
                                        <div className="relative group/select">
                                            <select
                                                value={workStart}
                                                onChange={(e) => handleSave('workStart', e.target.value)}
                                                className="bg-white border border-blue-100 rounded-lg px-2 py-1 font-bold text-[#1E2532] appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 pr-6"
                                            >
                                                {hours.map(h => <option key={h} value={h}>{h}</option>)}
                                            </select>
                                            <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-400"></div>
                                            </div>
                                        </div>
                                        <span className="text-[#1E2532] font-bold">:</span>
                                        <div className="relative group/select">
                                            <select
                                                value={startMinute}
                                                onChange={(e) => handleSave('startMinute', e.target.value)}
                                                className="bg-white border border-blue-100 rounded-lg px-2 py-1 font-bold text-[#1E2532] appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 pr-6"
                                            >
                                                {minutes.map(m => <option key={m} value={m}>{m}</option>)}
                                            </select>
                                            <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-400"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <span className="text-[#1E2532] font-bold mx-2">—</span>

                                    {/* End Time */}
                                    <div className="flex items-center gap-1">
                                        <div className="relative group/select">
                                            <select
                                                value={workEnd}
                                                onChange={(e) => handleSave('workEnd', e.target.value)}
                                                className="bg-white border border-blue-100 rounded-lg px-2 py-1 font-bold text-[#1E2532] appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 pr-6"
                                            >
                                                {hours.map(h => <option key={h} value={h}>{h}</option>)}
                                            </select>
                                            <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-400"></div>
                                            </div>
                                        </div>
                                        <span className="text-[#1E2532] font-bold">:</span>
                                        <div className="relative group/select">
                                            <select
                                                value={endMinute}
                                                onChange={(e) => handleSave('endMinute', e.target.value)}
                                                className="bg-white border border-blue-100 rounded-lg px-2 py-1 font-bold text-[#1E2532] appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 pr-6"
                                            >
                                                {minutes.map(m => <option key={m} value={m}>{m}</option>)}
                                            </select>
                                            <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-400"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center w-full gap-2 font-bold text-[#1E2532] text-lg">
                                    <span>{workStart}:{startMinute}</span>
                                    <span className="text-gray-300">—</span>
                                    <span>{workEnd}:{endMinute}</span>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isEditing ? 'bg-[#5B7FFF] text-white shadow-lg shadow-blue-100' : 'bg-[#F5F8FF] text-[#5B7FFF] hover:bg-blue-50'}`}
                        >
                            <Edit2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div>
                    <span className="font-bold text-[#1E2532] text-sm mb-4 block">{t('doctor_profile.weekend')}</span>
                    <button 
                        onClick={onAddDayOff}
                        className="w-full bg-[#5B7FFF] text-white py-4 rounded-[22px] font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-600 transition-all"
                    >
                        <Plus className="w-4 h-4" strokeWidth={3} /> {t('doctor_profile.add')}
                    </button>
                </div>

                {/* Days Off List */}
                {isLoading && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <span className="text-blue-600 text-sm">
                            {t('common.loading', 'Yuklanmoqda...')}
                        </span>
                    </div>
                )}

                {error && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <span className="text-red-600 text-sm font-bold">
                            {t('common.error', 'Xatolik:')} 
                        </span>
                        <div className="text-red-600 text-xs mt-1">
                            {error.message || 'API xatoligi'}
                        </div>
                    </div>
                )}

                {!isLoading && !error && daysOff.length === 0 && (
                    <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <span className="text-gray-600 text-sm">
                            {t('doctor_profile.no_days_off', 'Dam olish kunlari yo\'q')}
                        </span>
                    </div>
                )}

                {daysOff.length > 0 && (
                    <div className="mt-6">
                        <span className="font-bold text-[#1E2532] text-sm mb-4 block">
                            {t('doctor_profile.upcoming_days_off', 'Yaqinlashayotgan dam olish kunlari')}
                        </span>
                        <div className="space-y-3 max-h-48 overflow-y-auto">
                            {daysOff.map((dayOff) => (
                                <div
                                    key={dayOff.id}
                                    className="bg-[#F5F8FF] border border-blue-100 rounded-[16px] p-4 flex items-center justify-between hover:bg-blue-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <Calendar className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-[#1E2532] text-sm">
                                                {new Date(dayOff.date).toLocaleDateString('uz-UZ', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                            {dayOff.reason && (
                                                <div className="text-gray-600 text-xs mt-1">
                                                    {dayOff.reason}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteDayOff(dayOff.id)}
                                        className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                                        title={t('common.delete', 'O\'chirish')}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScheduleCard;
