import React from 'react';
import { useTranslation } from 'react-i18next';

const ClientStatusCharts: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            {/* Clients Chart */}
            <div className="bg-white rounded-[32px] p-6 shadow-sm flex flex-col h-full border border-gray-50 overflow-hidden">
                <h3 className="text-[#1e2235] font-bold text-xl mb-6">{t('analytics.charts.clients.title')}</h3>

                <div className="flex items-end gap-3 flex-1 pb-2">
                    {/* Bars Container */}
                    <div className="flex gap-2 items-end h-full">
                        <div className="w-[34px] bg-[#5377f7] rounded-full h-full flex items-end justify-center pb-3 min-h-[140px] shadow-sm">
                            <span className="text-white text-[10px] font-bold">32</span>
                        </div>
                        <div className="w-[34px] bg-[#8a8a8a] rounded-full h-[75%] flex items-end justify-center pb-3 min-h-[100px] shadow-sm">
                            <span className="text-white text-[10px] font-bold">24</span>
                        </div>
                    </div>

                    {/* Legend Container */}
                    <div className="flex flex-col gap-3 justify-center mb-10 pl-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#5377f7] shrink-0"></div>
                            <span className="text-[11px] font-bold text-[#1e2235] whitespace-nowrap">{t('analytics.charts.clients.old')}</span>
                        </div>
                        <div className="flex items-center gap-1.5 min-w-0">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#8a8a8a] shrink-0"></div>
                            <span className="text-[11px] font-bold text-[#1e2235] whitespace-nowrap">{t('analytics.charts.clients.new')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Chart */}
            <div className="bg-white rounded-[32px] p-6 shadow-sm flex flex-col h-full border border-gray-50">
                <h3 className="text-[#1e2235] font-bold text-xl mb-6">{t('analytics.charts.status.title')}</h3>

                <div className="space-y-4 flex-1 flex flex-col justify-center">
                    <div className="space-y-1">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-1">{t('analytics.charts.status.completed')}</span>
                        <div className="h-10 bg-[#1cdb6f] rounded-[20px] flex items-center justify-end px-4 shadow-sm">
                            <span className="text-white font-bold text-lg">45</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-1">{t('analytics.charts.status.rescheduled')}</span>
                        <div className="h-10 bg-[#fbc947] rounded-[20px] flex items-center justify-end px-4 shadow-sm">
                            <span className="text-white font-bold text-lg">24</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-1">{t('analytics.charts.status.cancelled')}</span>
                        <div className="h-10 bg-[#f21d1d] rounded-[20px] flex items-center justify-end px-4 shadow-sm">
                            <span className="text-white font-bold text-lg">12</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientStatusCharts;
