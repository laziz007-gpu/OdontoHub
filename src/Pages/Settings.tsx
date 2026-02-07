import React, { useState } from 'react';
import { SettingsHeader } from '../components/Settings/SettingsHeader';
import { SettingsTabs } from '../components/Settings/SettingsTabs';
import { NotificationSettings } from '../components/Settings/NotificationSettings';
import { PrivacySettings } from '../components/Settings/PrivacySettings';
import Language from '../components/Settings/Language';
import Image from '../components/Settings/Image';
import Support from '../components/Settings/Support';
const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Уведомление');

    const tabs = [
        'Уведомление',
        'Конфиденциальность',
        'Язык',
        'Управление данными',
        'Поддержка'
    ];

    return (
        <div className="w-full min-h-screen bg-[#F4F5FA] p-6 font-onest">
            {/* Top Bar */}
            <SettingsHeader />

            <h1 className="text-3xl font-bold text-[#1E2532] mb-6">Настройки</h1>

            {/* Tabs */}
            <SettingsTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabs={tabs}
            />

            {/* Content Area */}
            <div className="max-w-3xl">
                {activeTab === 'Уведомление' && <NotificationSettings />}
                {activeTab === 'Конфиденциальность' && <PrivacySettings />}
                {activeTab === 'Язык' && <Language />}
                {activeTab === 'Управление данными' && <Image />}
                {activeTab === 'Поддержка' && <Support />}
            </div>
        </div>
    );
};

export default Settings;
