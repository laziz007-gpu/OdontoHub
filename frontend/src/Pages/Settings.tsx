import React, { useState } from 'react';
import { SettingsHeader } from '../components/Settings/SettingsHeader';
import { SettingsTabs } from '../components/Settings/SettingsTabs';
import { NotificationSettings } from '../components/Settings/NotificationSettings';
import { PrivacySettings } from '../components/Settings/PrivacySettings';
import Language from '../components/Settings/Language';
import Image from '../components/Settings/Image';
import Support from '../components/Settings/Support';
import { useTranslation } from 'react-i18next';
import MobileHeaderAndDrawer from '../Layouts/MobileHeaderAndDrawer';

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
        <div className="w-full min-h-screen bg-[#F4F5FA] p-6 font-onest max-lg:pt-20">
            {/* Mobile Header */}
            <MobileHeaderAndDrawer />

            {/* Top Bar */}
            <SettingsHeader />

            <h1 className="text-3xl font-bold text-[#1E2532] mb-6">{t('settings.title')}</h1>

            {/* Tabs */}
            <SettingsTabs
                activeTab={tabs.find(t => t.id === activeTab)?.label || ''}
                setActiveTab={(label) => {
                    const tab = tabs.find(t => t.label === label);
                    if (tab) setActiveTab(tab.id);
                }}
                tabs={tabs.map(t => t.label)}
            />

            {/* Content Area */}
            <div className="max-w-3xl">
                {activeTab === 'notification' && <NotificationSettings />}
                {activeTab === 'privacy' && <PrivacySettings />}
                {activeTab === 'language' && <Language />}
                {activeTab === 'data_management' && <Image />}
                {activeTab === 'support' && <Support />}
            </div>
        </div>
    );
};

export default Settings;
