import { useTranslation } from 'react-i18next';

const CheckupInfoCard = () => {
    const { t } = useTranslation();
    return (
        <div className="bg-white rounded-[30px] border border-[#1D1D2B] p-6 md:p-8 w-full">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-[#1D1D2B] font-bold text-[18px] md:text-[20px]">{t('appointments.details.status')}:</span>
                    <span className="text-[#1D1D2B] font-bold text-[18px] md:text-[20px] opacity-80">{t('appointments.status.completed')}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[#1D1D2B] font-bold text-[18px] md:text-[20px]">{t('appointments.details.when')}:</span>
                    <span className="text-[#1D1D2B] font-bold text-[18px] md:text-[20px]">25.10.2025</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[#1D1D2B] font-bold text-[18px] md:text-[20px]">{t('appointments.details.duration')}:</span>
                    <span className="text-[#1D1D2B] font-bold text-[18px] md:text-[20px]">20 {t('appointments.details.minutes')}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[#1D1D2B] font-bold text-[18px] md:text-[20px]">{t('appointments.details.prescriptions')}:</span>
                    <span className="text-[#1D1D2B] font-bold text-[18px] md:text-[20px]">{t('appointments.details.empty')}</span>
                </div>
            </div>
        </div>
    );
};

export default CheckupInfoCard;
