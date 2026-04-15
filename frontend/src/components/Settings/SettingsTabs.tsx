import React from 'react';

interface SettingsTabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    tabs: string[];
}

export const SettingsTabs: React.FC<SettingsTabsProps> = ({ activeTab, setActiveTab, tabs }) => {
    return (
        <div className="mb-8 flex max-w-full gap-1 overflow-x-auto rounded-2xl bg-[#E9EAEF] p-1 sm:mb-10">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold whitespace-nowrap transition-all sm:px-6 ${activeTab === tab
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
