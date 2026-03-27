import React from 'react';
import { useTranslation } from 'react-i18next';

const AgeDistribution: React.FC = () => {
    const { t } = useTranslation();
    const ageGroups = [
        { label: '0-8', percent: 20, count: 154, color: '#1cdb6f' },
        { label: '8-18', percent: 25, count: 230, color: '#5377f7' },
        { label: '18-45', percent: 40, count: 443, color: '#1e2235' },
        { label: '45<', percent: 15, count: 121, color: '#00adef' },
    ];

    return (
        <div className="bg-white rounded-[32px] p-8 shadow-sm h-full border-4 border-[#00adef]/20">
            <div className="flex justify-between items-start mb-12">
                <h3 className="text-[#1e2235] font-bold text-2xl">{t('analytics.charts.age.title')}</h3>
                <div className="text-gray-400 font-medium text-xs text-right">{t('analytics.charts.age.subtitle')}</div>
            </div>

            <div className="space-y-12">
                {/* Labels and Counts */}
                <div className="grid grid-cols-4 gap-4">
                    {ageGroups.map((group) => (
                        <div key={group.label} className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-md" style={{ backgroundColor: group.color }}></div>
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-tight">
                                    {group.label} <span className="text-gray-800">({group.percent}%)</span>
                                </span>
                            </div>
                            <div className="flex items-baseline gap-0.5">
                                <span className="text-3xl font-bold text-[#1e2235]">{group.count}</span>
                                <span className="text-sm font-bold text-[#1e2235]">{t('analytics.charts.age.count_label')}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Progress Bar */}
                <div className="h-10 w-full flex rounded-xl overflow-hidden shadow-inner">
                    {ageGroups.map((group) => (
                        <div
                            key={group.label}
                            style={{
                                width: `${group.percent}%`,
                                backgroundColor: group.color
                            }}
                            className="h-full relative group cursor-pointer"
                        >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1e2235] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {group.label}: {group.count}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AgeDistribution;
