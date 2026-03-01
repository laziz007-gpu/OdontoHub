import { useTranslation } from "react-i18next";
interface MediaTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const MediaTabs = ({ activeTab, onTabChange }: MediaTabsProps) => {
    const { t } = useTranslation();
    const tabs = [
        { id: 'media', label: t('chat.tabs.media') },
        { id: 'files', label: t('chat.tabs.files') },
        { id: 'voice', label: t('chat.tabs.voice') },
        { id: 'links', label: t('chat.tabs.links') }
    ];

    return (
        <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8 bg-white p-1">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`px-8 py-3 rounded-xl text-sm font-black transition-all whitespace-nowrap border-2
                        ${activeTab === tab.id
                            ? "bg-[#5B7FFF] border-[#5B7FFF] text-white shadow-lg shadow-blue-500/25"
                            : "bg-white border-blue-500/20 text-[#5B7FFF] hover:border-blue-500/40"}`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default MediaTabs;
