import React from 'react';

interface SettingsTabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    tabs: string[];
}

export const SettingsTabs: React.FC<SettingsTabsProps> = ({ activeTab, setActiveTab, tabs }) => {
    return (
        <div className="bg-[#E9EAEF] p-1 rounded-2xl inline-flex mb-10 overflow-x-auto max-w-full">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab
                            ? 'bg-[#1E2532] text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};
