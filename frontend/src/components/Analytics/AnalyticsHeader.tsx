import React, { useState } from 'react';
import { ArrowLeft, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AnalyticsFilter from './AnalyticsFilter';
import { paths } from '../../Routes/path';

const AnalyticsHeader: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 md:mb-8">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors shrink-0"
                >
                    <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-[#1e2235]" />
                </button>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1e2235]">{t('analytics.title')}</h1>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <button
                    onClick={() => navigate(paths.finance)}
                    className="px-4 md:px-6 py-2 md:py-2.5 rounded-2xl border border-gray-300 font-semibold text-sm md:text-base text-[#1e2235] hover:bg-gray-50 transition-colors"
                >
                    {t('analytics.header.finance')}
                </button>
                <button
                    onClick={() => setIsFilterOpen(true)}
                    className="px-4 md:px-6 py-2 md:py-2.5 rounded-2xl bg-[#1e2235] text-white font-semibold text-sm md:text-base flex items-center gap-2 hover:bg-[#2c314a] transition-colors"
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
