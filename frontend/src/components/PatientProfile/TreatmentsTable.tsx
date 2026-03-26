import React from 'react';
import { useTranslation } from 'react-i18next';

interface Treatment {
    id: number;
    nameKey: string;
    period: string;
    appointmentsCount: number;
    amount: string;
    paymentStatus: 'paid' | 'unpaid';
    completionStatus: 'completed' | 'in_progress' | 'cancelled';
}

const mockTreatments: Treatment[] = [
    {
        id: 1,
        nameKey: 'implantation',
        period: '9дек-15дек',
        appointmentsCount: 3,
        amount: '2.500.000',
        paymentStatus: 'paid',
        completionStatus: 'completed',
    },
    {
        id: 2,
        nameKey: 'extraction',
        period: '9дек-15дек',
        appointmentsCount: 3,
        amount: '2.500.000',
        paymentStatus: 'unpaid',
        completionStatus: 'completed',
    },
    {
        id: 3,
        nameKey: 'filling',
        period: '9дек-15дек',
        appointmentsCount: 3,
        amount: '2.500.000',
        paymentStatus: 'paid',
        completionStatus: 'completed',
    },
];

const TreatmentsTable: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-separate border-spacing-y-2 min-w-[800px] lg:min-w-full">
                <thead>
                    <tr className="text-gray-500 uppercase text-[10px] md:text-sm font-bold">
                        <th className="px-3 md:px-6 py-4">{t('patient_profile.treatments_table.no')}</th>
                        <th className="px-3 md:px-6 py-4">{t('patient_profile.treatments_table.name')}</th>
                        <th className="px-3 md:px-6 py-4 text-center">{t('patient_profile.treatments_table.period')}</th>
                        <th className="px-3 md:px-6 py-4 text-center">{t('patient_profile.treatments_table.appointments')}</th>
                        <th className="px-3 md:px-6 py-4 text-center">{t('patient_profile.treatments_table.amount')}</th>
                        <th className="px-3 md:px-6 py-4 text-center">{t('patient_profile.treatments_table.status1')}</th>
                        <th className="px-3 md:px-6 py-4 text-center">{t('patient_profile.treatments_table.status2')}</th>
                    </tr>
                </thead>
                <tbody className="space-y-4">
                    {mockTreatments.map((treatment, index) => (
                        <tr
                            key={treatment.id}
                            className={`${index === 0 ? 'bg-blue-50' : 'bg-transparent'} hover:bg-gray-50 transition-colors rounded-2xl`}
                        >
                            <td className="px-3 md:px-6 py-4 md:py-6 font-bold text-[#1e2235] first:rounded-l-2xl text-sm md:text-base">{treatment.id}</td>
                            <td className="px-3 md:px-6 py-4 md:py-6 font-bold text-[#1e2235] text-sm md:text-base">
                                {/* Fallback to raw string if specific service translation doesn't exist */}
                                {treatment.nameKey === 'implantation' ? t('modal.services.implantation') :
                                    treatment.nameKey === 'extraction' ? (t('modal.services.extraction') || 'Удаление') :
                                        treatment.nameKey === 'filling' ? (t('modal.services.filling') || 'Пломба') : treatment.nameKey}
                            </td>
                            <td className="px-3 md:px-6 py-4 md:py-6 font-bold text-[#1e2235] text-center text-sm md:text-base">{treatment.period}</td>
                            <td className="px-3 md:px-6 py-4 md:py-6 font-bold text-[#1e2235] text-center text-sm md:text-base uppercase">
                                {treatment.appointmentsCount} {t('patient_profile.treatments_table.appointments').toLowerCase()}
                            </td>
                            <td className="px-3 md:px-6 py-4 md:py-6 font-bold text-[#1e2235] text-center text-sm md:text-base whitespace-nowrap">{treatment.amount}</td>
                            <td className="px-3 md:px-6 py-4 md:py-6 text-center">
                                <span className={`font-bold text-xs md:text-base uppercase ${treatment.paymentStatus === 'paid' ? 'text-green-500' : 'text-red-500'}`}>
                                    {treatment.paymentStatus === 'paid' ? t('patient_profile.treatments_table.paid') : t('patient_profile.treatments_table.unpaid')}
                                </span>
                            </td>
                            <td className="px-3 md:px-6 py-4 md:py-6 text-center last:rounded-r-2xl">
                                <span className="font-bold text-blue-600 text-xs md:text-base uppercase">
                                    {treatment.completionStatus === 'completed' && t('patient_profile.treatments_table.completed')}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TreatmentsTable;
