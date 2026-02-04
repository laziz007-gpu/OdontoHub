import React, { useState } from 'react';
import { ArrowLeft, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AnalyticsFilter from './AnalyticsFilter';

const AnalyticsHeader: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    return (
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-[#1e2235]" />
                </button>
                <h1 className="text-4xl font-bold text-[#1e2235]">{t('analytics.title')}</h1>
            </div>
            <div className="flex items-center gap-4">
                <button className="px-6 py-2.5 rounded-2xl border border-gray-300 font-semibold text-[#1e2235] hover:bg-gray-50 transition-colors">
                    {t('analytics.header.finance')}
                </button>
                <button
                    onClick={() => setIsFilterOpen(true)}
                    className="px-6 py-2.5 rounded-2xl bg-[#1e2235] text-white font-semibold flex items-center gap-2 hover:bg-[#2c314a] transition-colors"
                >
                    <Filter className="w-4 h-4" />
                    {t('analytics.header.filter')}
                </button>
            </div>

            <AnalyticsFilter
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
            />
        </div>
    );
};

export default AnalyticsHeader;
