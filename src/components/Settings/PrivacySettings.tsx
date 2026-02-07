import React from 'react';
import { useTranslation } from 'react-i18next';

export const PrivacySettings: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="space-y-4">
            <button className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-2xl text-sm mb-6 transition-colors">
                {t('settings.privacy.change_password')}
            </button>

            <div className="bg-[#94A4FF] p-5 rounded-2xl cursor-pointer hover:opacity-90 transition-opacity">
                <h3 className="text-lg font-bold text-white mb-1">{t('settings.privacy.active_sessions_title')}</h3>
                <p className="text-sm text-white/90">{t('settings.privacy.active_sessions_desc')}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl cursor-pointer hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-[#1E2532] mb-1">{t('settings.privacy.add_device_title')}</h3>
                <p className="text-sm text-gray-400">{t('settings.privacy.add_device_desc')}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl cursor-pointer hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-[#1E2532] mb-1">{t('settings.privacy.backup_number_title')}</h3>
                <p className="text-sm text-gray-400">{t('settings.privacy.backup_number_desc')}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl cursor-pointer hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-red-500 underline mb-1">{t('settings.privacy.delete_account_title')}</h3>
                <p className="text-sm text-gray-400">{t('settings.privacy.delete_account_desc')}</p>
            </div>

            <div className="pt-20">
                <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-12 rounded-2xl text-sm transition-colors">
                    {t('settings.privacy.logout')}
                </button>
            </div>
        </div>
    );
};
