interface MediaTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const MediaTabs = ({ activeTab, onTabChange }: MediaTabsProps) => {
    const tabs = ['Медиа', 'Файлы', 'Голосовые', 'Ссылки'];

    return (
        <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8 bg-white p-1">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    className={`px-8 py-3 rounded-xl text-sm font-black transition-all whitespace-nowrap border-2
                        ${activeTab === tab
                            ? "bg-[#5B7FFF] border-[#5B7FFF] text-white shadow-lg shadow-blue-500/25"
                            : "bg-white border-blue-500/20 text-[#5B7FFF] hover:border-blue-500/40"}`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};

export default MediaTabs;
