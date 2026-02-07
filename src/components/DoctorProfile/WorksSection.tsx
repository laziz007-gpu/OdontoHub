import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, ImageIcon } from 'lucide-react';

const WorksSection: FC = () => {
    const { t } = useTranslation();
    return (
        <div>
            <div className="flex justify-between items-center mb-5">
                <h3 className="text-2xl font-bold text-[#1E2532]">{t('doctor_profile.my_works')}</h3>
                <button className="flex items-center gap-1.5 bg-[#5B7FFF] text-white px-4 py-1.5 rounded-full text-[11px] font-bold hover:bg-blue-600 transition-all">
                    {t('doctor_profile.add')}
                    <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                        <Plus className="w-2.5 h-2.5 text-blue-600" strokeWidth={4} />
                    </div>
                </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {[1, 2, 3, 4, 5, 0].map((i) => (
                    <div key={i} className={`aspect-square bg-gray-200 rounded-[24px] flex items-center justify-center relative overflow-hidden group hover:bg-gray-300 transition-all cursor-pointer border border-gray-100`}>
                        <div className="w-12 h-12 flex items-center justify-center opacity-40 group-hover:scale-110 transition-transform">
                            <ImageIcon className="w-10 h-10 text-gray-500" strokeWidth={1} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorksSection;
