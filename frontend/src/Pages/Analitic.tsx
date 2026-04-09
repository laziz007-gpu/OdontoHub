import { useState, useMemo } from 'react';
import { useDentistStats } from '../api/profile';
import { useMyAppointments } from '../api/appointments';
import AnalyticsHeader from '../components/Analytics/AnalyticsHeader';
import { Users, CalendarCheck, CalendarClock, TrendingUp, CheckCircle, Clock, CalendarDays } from 'lucide-react';

type Period = 'week' | 'month';

const Analitic = () => {
    const { data: stats, isLoading } = useDentistStats();
    const { data: allAppointments = [] } = useMyAppointments();
    const [period, setPeriod] = useState<Period>('month');

    const filtered = useMemo(() => {
        const now = new Date();
        const cutoff = period === 'week'
            ? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            : new Date(now.getFullYear(), now.getMonth(), 1);
        return allAppointments.filter(a => new Date(a.start_time) >= cutoff);
    }, [allAppointments, period]);

    const completed = filtered.filter(a => a.status === 'completed').length;
    const cancelled = filtered.filter(a => a.status === 'cancelled').length;
    const moved = filtered.filter(a => a.status === 'moved').length;
    const pending = filtered.filter(a => a.status === 'pending' || a.status === 'confirmed').length;
    const total = filtered.length;

    // Monthly chart
    const monthlyCounts = Array(12).fill(0);
    allAppointments.forEach(a => {
        const m = new Date(a.start_time).getMonth();
        monthlyCounts[m]++;
    });
    const maxMonthly = Math.max(...monthlyCounts, 1);

    const statCards = [
        { label: 'Jami qabullar', value: isLoading ? '...' : stats?.total_appointments ?? 0, icon: CalendarCheck, color: 'bg-[#5377f7]', text: 'text-white' },
        { label: 'Bugungi qabullar', value: isLoading ? '...' : stats?.appointments_today ?? 0, icon: CalendarDays, color: 'bg-[#00d68f]', text: 'text-white' },
        { label: 'Bu oyda', value: isLoading ? '...' : stats?.appointments_this_month ?? 0, icon: CalendarClock, color: 'bg-[#f2c94c]', text: 'text-[#1e2235]' },
        { label: 'Kutilayotgan', value: isLoading ? '...' : stats?.pending_appointments ?? 0, icon: Clock, color: 'bg-white border border-gray-100', text: 'text-[#1e2235]' },
        { label: 'Tugallangan', value: isLoading ? '...' : stats?.completed_appointments ?? 0, icon: CheckCircle, color: 'bg-white border border-gray-100', text: 'text-[#1e2235]' },
        { label: 'Jami bemorlar', value: isLoading ? '...' : stats?.total_patients ?? 0, icon: Users, color: 'bg-[#1e2235]', text: 'text-white' },
    ];

    const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];

    const pct = (n: number) => total > 0 ? Math.round((n / total) * 100) : 0;

    return (
        <div className="flex-1 bg-[#f5f7fb] min-h-screen overflow-y-auto">
            <div className="max-w-[1600px] mx-auto p-4 md:p-8">
                <AnalyticsHeader />

                {/* Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4 mb-6 md:mb-8">
                    {statCards.map((card, i) => {
                        const Icon = card.icon;
                        return (
                            <div key={i} className={`${card.color} rounded-[20px] md:rounded-[28px] p-4 md:p-6 shadow-sm flex flex-col gap-2 md:gap-3`}>
                                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center ${card.text === 'text-white' ? 'bg-white/20' : 'bg-gray-100'}`}>
                                    <Icon size={18} className={card.text} />
                                </div>
                                <div className={`text-2xl md:text-3xl xl:text-4xl font-black ${card.text}`}>{String(card.value)}</div>
                                <div className={`text-[11px] md:text-xs font-bold ${card.text === 'text-white' ? 'opacity-70' : 'text-gray-400'}`}>{card.label}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Period Filter */}
                <div className="flex gap-3 mb-6">
                    <button
                        onClick={() => setPeriod('week')}
                        className={`px-6 py-2.5 rounded-2xl font-bold text-sm transition-all ${period === 'week' ? 'bg-[#5377f7] text-white shadow-lg shadow-blue-500/20' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                    >
                        1 hafta
                    </button>
                    <button
                        onClick={() => setPeriod('month')}
                        className={`px-6 py-2.5 rounded-2xl font-bold text-sm transition-all ${period === 'month' ? 'bg-[#5377f7] text-white shadow-lg shadow-blue-500/20' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                    >
                        1 oy
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
                    {/* Monthly Chart */}
                    <div className="lg:col-span-2 bg-white rounded-[24px] md:rounded-[32px] p-4 md:p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-4 md:mb-8">
                            <h3 className="text-[#1e2235] font-black text-lg md:text-2xl">Oylik qabullar</h3>
                            <span className="text-gray-400 text-sm font-bold">{new Date().getFullYear()}</span>
                        </div>
                        <div className="flex items-end gap-1 md:gap-2 h-36 md:h-48">
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
                    <div className="bg-white rounded-[24px] md:rounded-[32px] p-4 md:p-8 shadow-sm flex flex-col">
                        <h3 className="text-[#1e2235] font-black text-lg md:text-2xl mb-2">Holat bo'yicha</h3>
                        <p className="text-xs text-gray-400 font-bold mb-4 md:mb-6">{period === 'week' ? 'So\'nggi 7 kun' : 'Bu oy'} — {total} ta qabul</p>
                        <div className="space-y-4 flex-1 flex flex-col justify-center">
                            {[
                                { label: 'Tugallangan', value: completed, pct: pct(completed), color: '#1cdb6f' },
                                { label: 'Kutilayotgan', value: pending, pct: pct(pending), color: '#5377f7' },
                                { label: 'Ko\'chirilgan', value: moved, pct: pct(moved), color: '#f2c94c' },
                                { label: 'Bekor qilingan', value: cancelled, pct: pct(cancelled), color: '#ef4444' },
                            ].map((item) => (
                                <div key={item.label} className="space-y-1.5">
                                    <div className="flex justify-between text-sm font-bold">
                                        <span className="text-gray-500">{item.label}</span>
                                        <span style={{ color: item.color }}>{item.value} ({item.pct}%)</span>
                                    </div>
                                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full transition-all" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-100 grid grid-cols-2 gap-3">
                            {[
                                { label: 'Tugallangan', value: completed, color: 'text-[#1cdb6f]' },
                                { label: 'Kutilmoqda', value: pending, color: 'text-[#5377f7]' },
                                { label: "Ko'chirilgan", value: moved, color: 'text-[#f2c94c]' },
                                { label: 'Bekor', value: cancelled, color: 'text-red-400' },
                            ].map(item => (
                                <div key={item.label} className="text-center">
                                    <div className={`text-xl md:text-2xl font-black ${item.color}`}>{item.value}</div>
                                    <div className="text-xs text-gray-400 font-bold">{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom row */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                    <div className="bg-[#4156d9] rounded-[24px] md:rounded-[32px] p-5 md:p-8 text-white shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-3 md:mb-4">
                            <span className="font-bold text-sm md:text-lg opacity-80">Bu hafta yangi bemorlar</span>
                            <TrendingUp size={20} className="opacity-60 shrink-0" />
                        </div>
                        <div className="text-5xl md:text-7xl font-black">{isLoading ? '...' : stats?.new_patients_this_week ?? 0}</div>
                        <div className="text-xs md:text-sm opacity-60 mt-2">so'nggi 7 kun ichida</div>
                    </div>

                    <div className="bg-white rounded-[24px] md:rounded-[32px] p-5 md:p-8 shadow-sm flex flex-col justify-between">
                        <h3 className="text-[#1e2235] font-black text-lg md:text-xl mb-3 md:mb-4">Bugun</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 md:p-4 bg-[#f5f7fb] rounded-2xl">
                                <span className="text-gray-500 font-bold text-sm">Qabullar</span>
                                <span className="text-[#1e2235] font-black text-xl md:text-2xl">{isLoading ? '...' : stats?.appointments_today ?? 0}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 md:p-4 bg-[#f5f7fb] rounded-2xl">
                                <span className="text-gray-500 font-bold text-sm">Bu oy</span>
                                <span className="text-[#1e2235] font-black text-xl md:text-2xl">{isLoading ? '...' : stats?.appointments_this_month ?? 0}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1e2235] rounded-[24px] md:rounded-[32px] p-5 md:p-8 text-white shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-3 md:mb-4">
                            <span className="font-bold text-sm md:text-lg opacity-80">Umumiy ko'rsatkichlar</span>
                            <Users size={20} className="opacity-60 shrink-0" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="opacity-60 text-sm">Jami bemorlar</span>
                                <span className="font-black text-lg md:text-xl">{isLoading ? '...' : stats?.total_patients ?? 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="opacity-60 text-sm">Jami qabullar</span>
                                <span className="font-black text-lg md:text-xl">{isLoading ? '...' : stats?.total_appointments ?? 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="opacity-60 text-sm">Tugallangan</span>
                                <span className="font-black text-lg md:text-xl text-[#1cdb6f]">{isLoading ? '...' : stats?.completed_appointments ?? 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analitic;
