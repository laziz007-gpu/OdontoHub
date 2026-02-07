import React from 'react';
import { useTranslation } from 'react-i18next';
import OnlineSupport from '../../assets/img/icons/OnlineSupport.svg';
import FAQ from '../../assets/img/icons/FAQ.svg';
import PrivacyPolicy from '../../assets/img/icons/PrivacyPolicy.svg';
import About from '../../assets/img/icons/About.svg';

const Support: React.FC = () => {
    const { t } = useTranslation();
    const items = [
        { icon: OnlineSupport, label: t('settings.support_items.contact') },
        { icon: FAQ, label: t('settings.support_items.faq') },
        { icon: PrivacyPolicy, label: t('settings.support_items.privacy_policy') },
        { icon: About, label: t('settings.support_items.about') },
    ];

    return (
        <div className="flex flex-col gap-4">
            {items.map((item, index) => (
                <button
                    key={index}
                    className="w-full bg-white p-4 rounded-2xl flex items-center gap-4 hover:shadow-sm transition-shadow text-left group"
                >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 group-hover:bg-blue-50 transition-colors">
                        <img src={item.icon} alt={item.label} className="w-6 h-6" />
                    </div>
                    <span className="text-[#1E2532] font-bold flex-1">{item.label}</span>
                </button>
            ))}
        </div>
    );
};

export default Support;
