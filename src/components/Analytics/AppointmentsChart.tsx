import React from 'react';
import { useTranslation } from 'react-i18next';

const AppointmentsChart: React.FC = () => {
    const { t } = useTranslation();
    // Mock data based on the image
    const data = [190, 220, 205, 235, 210, 150, 175, 215, 120, 225, 140, 190];
    const max = 240;

    return (
        <div className="bg-white rounded-[32px] p-8 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-start mb-12">
                <div>
                    <h3 className="text-[#1e2235] font-bold text-2xl mb-1">{t('analytics.charts.appointments.title')}</h3>
                </div>
                <div className="text-gray-400 font-medium text-sm">{t('analytics.charts.appointments.subtitle')}</div>
            </div>

            <div className="relative flex-1 min-h-[240px] flex items-end">
                {/* Horizontal grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {[240, 220, 200, 180, 160, 140, 120, 100].map((val) => (
                        <div key={val} className="flex items-center gap-4 w-full h-0">
                            <span className="text-[10px] text-gray-400 w-8 text-right shrink-0">{val}</span>
                            <div className="flex-1 h-px bg-gray-100"></div>
                        </div>
                    ))}
                </div>

                {/* Bars Container */}
                <div className="flex-1 ml-12 h-full flex items-end justify-between gap-2 pt-4 relative">
                    {data.map((val, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                            <div
                                className="w-full max-w-[24px] bg-[#5377f7] rounded-md transition-all duration-300 group-hover:bg-blue-600 relative cursor-pointer"
                                style={{ height: `${(val / max) * 100}%` }}
                            >
                                {/* Tooltip */}
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1e2235] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30 shadow-lg">
                                    {val} {t('analytics.charts.appointments.appointments_label')}
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 mt-1 shrink-0">{idx + 1}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AppointmentsChart;
