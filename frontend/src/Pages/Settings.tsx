import React, { useState } from 'react';
import { SettingsHeader } from '../components/Settings/SettingsHeader';
import { SettingsTabs } from '../components/Settings/SettingsTabs';
import { NotificationSettings } from '../components/Settings/NotificationSettings';
import { PrivacySettings } from '../components/Settings/PrivacySettings';
import Language from '../components/Settings/Language';
import Image from '../components/Settings/Image';
import Support from '../components/Settings/Support';
import DoctorPageShell from '../components/Layout/DoctorPageShell';
import { useTranslation } from 'react-i18next';

const Settings: React.FC = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('notification');

    const tabs = [
        { id: 'notification', label: t('settings.tabs.notification') },
        { id: 'privacy', label: t('settings.tabs.privacy') },
        { id: 'language', label: t('settings.tabs.language') },
        { id: 'data_management', label: t('settings.tabs.data_management') },
        { id: 'support', label: t('settings.tabs.support') }
    ];

    return (
        <DoctorPageShell
            badge="Settings"
            title={t('settings.title')}
            accent="Профиль и безопасность"
            description="Настройте уведомления, конфиденциальность, язык интерфейса и вспомогательные параметры в том же визуальном стиле, что и экраны входа."
            contentClassName="p-4 sm:p-6 lg:p-8"
        >
            <div className="mx-auto max-w-6xl font-onest">
                <SettingsHeader />

                <div className="mb-6 sm:mb-8">
                    <p
                        className="text-sm font-semibold uppercase tracking-[0.22em] text-[#7080ff]"
                        style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                    >
                        Preferences
                    </p>
                    <h1
                        className="mt-2 text-3xl font-bold text-[#141b33] sm:text-4xl"
                        style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                    >
                        {t('settings.title')}
                    </h1>
                </div>

                <SettingsTabs
                    activeTab={tabs.find(t => t.id === activeTab)?.label || ''}
                    setActiveTab={(label) => {
                        const tab = tabs.find(t => t.label === label);
                        if (tab) setActiveTab(tab.id);
                    }}
                    tabs={tabs.map(t => t.label)}
                />

                <div className="max-w-4xl">
                    {activeTab === 'notification' && <NotificationSettings />}
                    {activeTab === 'privacy' && <PrivacySettings />}
                    {activeTab === 'language' && <Language />}
                    {activeTab === 'data_management' && <Image />}
                    {activeTab === 'support' && <Support />}
                </div>
            </div>
        </DoctorPageShell>
    );
};

export default Settings;
