import { useDentistStats } from '../api/profile';
import { useMyAppointments } from '../api/appointments';
import AnalyticsHeader from '../components/Analytics/AnalyticsHeader';
import { useTranslation } from 'react-i18next';
import { Users, CalendarCheck, CalendarClock, TrendingUp, CheckCircle, XCircle, Clock, CalendarDays } from 'lucide-react';

const Analitic = () => {
    const { t } = useTranslation();
    const { data: stats, isLoading } = useDentistStats();
    const { data: appointments = [] } = useMyAppointments();

    // Count by status from real appointments
    const completed = appointments.filter(a => a.status === 'completed').length;
    const cancelled = appointments.filter(a => a.status === 'cancelled').length;
    const pending = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed').length;

    // Monthly chart — count appointments per month from real data
    const monthlyCounts = Array(12).fill(0);
    appointments.forEach(a => {
        const m = new Date(a.start_time).getMonth();
        monthlyCounts[m]++;
    });
    const maxMonthly = Math.max(...monthlyCounts, 1);

    const statCards = [
        {
            label: 'Jami qabullar',
            value: isLoading ? '...' : stats?.total_appointments ?? 0,
            icon: CalendarCheck,
            color: 'bg-[#5377f7]',
            text: 'text-white',
        },
        {
            label: 'Bugungi qabullar',
            value: isLoading ? '...' : stats?.appointments_today ?? 0,
            icon: CalendarDays,
            color: 'bg-[#00d68f]',
            text: 'text-white',
        },
        {
            label: 'Bu oyda',
            value: isLoading ? '...' : stats?.appointments_this_month ?? 0,
            icon: CalendarClock,
            color: 'bg-[#f2c94c]',
            text: 'text-[#1e2235]',
        },
        {
            label: 'Kutilayotgan',
            value: isLoading ? '...' : stats?.pending_appointments ?? 0,
            icon: Clock,
            color: 'bg-white border border-gray-100',
            text: 'text-[#1e2235]',
        },
        {
            label: 'Tugallangan',
            value: isLoading ? '...' : stats?.completed_appointments ?? 0,
            icon: CheckCircle,
            color: 'bg-white border border-gray-100',
            text: 'text-[#1e2235]',
        },
        {
            label: 'Jami bemorlar',
            value: isLoading ? '...' : stats?.total_patients ?? 0,
            icon: Users,
            color: 'bg-[#1e2235]',
            text: 'text-white',
        },
    ];

    const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];

    return (
        <div className="flex-1 bg-[#f5f7fb] min-h-screen overflow-y-auto">
            <div className="max-w-[1600px] mx-auto p-4 md:p-8">
                <AnalyticsHeader />

                {/* Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
                    {statCards.map((card, i) => {
                        const Icon = card.icon;
                        return (
                            <div key={i} className={`${card.color} rounded-[28px] p-6 shadow-sm flex flex-col gap-3`}>
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${card.text === 'text-white' ? 'bg-white/20' : 'bg-gray-100'}`}>
                                    <Icon size={20} className={card.text} />
                                </div>
                                <div className={`text-4xl font-black ${card.text}`}>{String(card.value)}</div>
                                <div className={`text-xs font-bold ${card.text === 'text-white' ? 'opacity-70' : 'text-gray-400'}`}>{card.label}</div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                    {/* Monthly Chart */}
                    <div className="xl:col-span-2 bg-white rounded-[32px] p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-[#1e2235] font-black text-2xl">Oylik qabullar</h3>
                            <span className="text-gray-400 text-sm font-bold">{new Date().getFullYear()}</span>
                        </div>
                        <div className="flex items-end gap-2 h-48">
                            {monthlyCounts.map((count, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                                    <div
                                        className="w-full rounded-lg bg-[#5377f7] hover:bg-[#4156d9] transition-all cursor-pointer relative"
                                        style={{ height: `${Math.max((count / maxMonthly) * 100, count > 0 ? 8 : 2)}%` }}
                                    >
                                        {count > 0 && (
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1e2235] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                {count} ta
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[9px] font-bold text-gray-400">{months[i]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Status Breakdown */}
                    <div className="bg-white rounded-[32px] p-8 shadow-sm flex flex-col">
                        <h3 className="text-[#1e2235] font-black text-2xl mb-6">Holat bo'yicha</h3>
                        <div className="space-y-4 flex-1 flex flex-col justify-center">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-gray-500">Tugallangan</span>
                                    <span className="text-[#1cdb6f]">{completed}</span>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#1cdb6f] rounded-full transition-all"
                                        style={{ width: `${stats?.total_appointments ? (completed / stats.total_appointments) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-gray-500">Kutilayotgan</span>
                                    <span className="text-[#5377f7]">{pending}</span>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#5377f7] rounded-full transition-all"
                                        style={{ width: `${stats?.total_appointments ? (pending / stats.total_appointments) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-gray-500">Bekor qilingan</span>
                                    <span className="text-red-500">{cancelled}</span>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-red-400 rounded-full transition-all"
                                        style={{ width: `${stats?.total_appointments ? (cancelled / stats.total_appointments) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Summary ring */}
                        <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                            <div className="text-center">
                                <div className="text-2xl font-black text-[#1cdb6f]">{completed}</div>
                                <div className="text-xs text-gray-400 font-bold">Tugallangan</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-black text-[#5377f7]">{pending}</div>
                                <div className="text-xs text-gray-400 font-bold">Kutilmoqda</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-black text-red-400">{cancelled}</div>
                                <div className="text-xs text-gray-400 font-bold">Bekor</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom row */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* This week new patients */}
                    <div className="bg-[#4156d9] rounded-[32px] p-8 text-white shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-bold text-lg opacity-80">Bu hafta yangi bemorlar</span>
                            <TrendingUp size={24} className="opacity-60" />
                        </div>
                        <div className="text-7xl font-black">{isLoading ? '...' : stats?.new_patients_this_week ?? 0}</div>
                        <div className="text-sm opacity-60 mt-2">so'nggi 7 kun ichida</div>
                    </div>

                    {/* Today summary */}
                    <div className="bg-white rounded-[32px] p-8 shadow-sm flex flex-col justify-between">
                        <h3 className="text-[#1e2235] font-black text-xl mb-4">Bugun</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-4 bg-[#f5f7fb] rounded-2xl">
                                <span className="text-gray-500 font-bold text-sm">Qabullar</span>
                                <span className="text-[#1e2235] font-black text-2xl">{isLoading ? '...' : stats?.appointments_today ?? 0}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-[#f5f7fb] rounded-2xl">
                                <span className="text-gray-500 font-bold text-sm">Bu oy</span>
                                <span className="text-[#1e2235] font-black text-2xl">{isLoading ? '...' : stats?.appointments_this_month ?? 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Total overview */}
                    <div className="bg-[#1e2235] rounded-[32px] p-8 text-white shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-bold text-lg opacity-80">Umumiy ko'rsatkichlar</span>
                            <Users size={24} className="opacity-60" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="opacity-60 text-sm">Jami bemorlar</span>
                                <span className="font-black text-xl">{isLoading ? '...' : stats?.total_patients ?? 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="opacity-60 text-sm">Jami qabullar</span>
                                <span className="font-black text-xl">{isLoading ? '...' : stats?.total_appointments ?? 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="opacity-60 text-sm">Tugallangan</span>
                                <span className="font-black text-xl text-[#1cdb6f]">{isLoading ? '...' : stats?.completed_appointments ?? 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analitic;
