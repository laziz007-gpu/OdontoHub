import React from 'react';
import { User, UserRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const GenderChart: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-sm h-full flex flex-col min-w-0">
            <div className="flex justify-between items-start mb-6">
                <h3 className="text-[#1e2235] font-bold text-xl lg:text-2xl whitespace-nowrap">{t('analytics.charts.patients.title')}</h3>
                <div className="text-gray-400 font-medium text-[10px] lg:text-xs text-right leading-tight max-w-[100px]">{t('analytics.charts.patients.subtitle')}</div>
            </div>

            <div className="flex flex-col xl:flex-row items-center justify-between gap-4 flex-1">
                {/* Donut Chart SVG */}
                <div className="relative w-[140px] h-[140px] flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                        {/* Men 57% */}
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            stroke="#5377f7"
                            strokeWidth="10"
                            strokeDasharray={`${57 * 2.51} ${100 * 2.51}`}
                            className="transition-all duration-700"
                        />
                        {/* Women 43% */}
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            stroke="#ff5e9c"
                            strokeWidth="10"
                            strokeDasharray={`${43 * 2.51} ${100 * 2.51}`}
                            strokeDashoffset={`-${57 * 2.51}`}
                            className="transition-all duration-700"
                        />
                    </svg>

                    {/* Floating Labels */}
                    <div className="absolute top-[15%] -right-2 text-[9px] font-bold text-[#1e2235] bg-white shadow-md border border-gray-50 px-1.5 py-0.5 rounded-md z-10">480{t('analytics.charts.patients.count_label')}</div>
                    <div className="absolute bottom-[15%] -left-2 text-[9px] font-bold text-[#1e2235] bg-white shadow-md border border-gray-50 px-1.5 py-0.5 rounded-md z-10">361{t('analytics.charts.patients.count_label')}</div>
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-4 w-full xl:pl-2">
                    <div className="flex items-center justify-between group cursor-default">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                <User className="w-3.5 h-3.5 text-[#5377f7]" />
                            </div>
                            <span className="text-xs font-bold text-[#5377f7]">{t('analytics.charts.patients.male')}</span>
                            <span className="text-xs font-bold text-[#5377f7]">57%</span>
                        </div>

                    </div>

                    <div className="flex items-center justify-between group cursor-default">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center shrink-0">
                                <UserRound className="w-3.5 h-3.5 text-[#ff5e9c]" />
                            </div>
                            <span className="text-xs font-bold text-[#ff5e9c]">{t('analytics.charts.patients.female')}</span>
                            <span className="text-xs font-bold text-[#ff5e9c]">43%</span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenderChart;
