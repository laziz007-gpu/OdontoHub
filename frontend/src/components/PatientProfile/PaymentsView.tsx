import React from 'react';
import { useTranslation } from 'react-i18next';

interface PaymentItem {
    id: number;
    name: string;
    amount: string;
    date: string;
}

const mockPayments: PaymentItem[] = [
    { id: 1, name: 'Имплантация', amount: '2.500.000сум', date: '9.06.26' },
    { id: 2, name: 'Пломба', amount: '250.000сум', date: '9.06.26' },
    { id: 3, name: 'Удаление', amount: '250.000сум', date: '9.06.26' },
    { id: 4, name: 'Осмотр', amount: '00.000сум', date: '9.06.26' },
];

const PaymentsView: React.FC = () => {
    const { t } = useTranslation();

    const stats = [
        { label: t('patient_profile.payments_view.payment_percentage'), value: '100%', isPercentage: true },
        { label: t('patient_profile.payments_view.paid'), value: '5.500.000сум' },
        { divider: true },
        { label: t('patient_profile.payments_view.paid_to_you'), value: '2.000.000сум' },
        { label: t('patient_profile.payments_view.percentage'), value: '63%', isPercentage: true },
        { divider: true },
        { label: t('patient_profile.payments_view.debts'), value: '1.000.000сум' },
        { label: t('patient_profile.payments_view.percentage'), value: '34%', isPercentage: true },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 md:gap-8 animate-in fade-in duration-500">
            {/* Left Column: Stats */}
            <div className="space-y-4 md:space-y-6 flex flex-col justify-center bg-gray-50/50 md:bg-transparent p-4 md:p-0 rounded-[24px]">
                {stats.map((stat, idx) => (
                    stat.divider ? (
                        <div key={`div-${idx}`} className="hidden md:block h-4" />
                    ) : (
                        <div key={idx} className="flex justify-between items-center px-0 md:px-4">
                            <span className="text-gray-400 font-bold text-sm md:text-lg uppercase tracking-wide">{stat.label}</span>
                            <span className="text-[#1e2235] font-black text-base md:text-xl">
                                {stat.value}
                            </span>
                        </div>
                    )
                ))}
            </div>

            {/* Right Column: Cards */}
            <div className="bg-[#f5f7fb] rounded-[24px] md:rounded-[40px] p-4 md:p-8 space-y-4 md:space-y-4">
                {mockPayments.map((payment) => (
                    <div
                        key={payment.id}
                        className="bg-[#fbc947] rounded-[24px] md:rounded-[30px] p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-transform hover:scale-[1.01] shadow-sm"
                    >
                        <span className="text-white font-black text-xl md:text-2xl leading-none">{payment.name}</span>
                        <div className="flex justify-between sm:justify-end gap-6 md:gap-12 text-white font-black text-lg md:text-2xl w-full sm:w-auto border-t sm:border-0 border-white/20 pt-3 sm:pt-0">
                            <span className="whitespace-nowrap">{payment.amount}</span>
                            <span className="opacity-80 sm:opacity-100">{payment.date}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PaymentsView;
