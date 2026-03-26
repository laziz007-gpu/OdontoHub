interface LinkItem {
    name: string;
    date: string;
    url: string;
}

interface LinksListProps {
    links: LinkItem[];
}

const LinksList = ({ links }: LinksListProps) => {
    return (
        <div className="space-y-1">
            {links.map((link, idx) => (
                <div key={idx} className="flex items-center gap-4 py-4 border-b border-gray-50 last:border-0 group cursor-pointer hover:bg-gray-50/50 px-2 rounded-2xl transition-colors">
                    <div className="w-12 h-12 bg-[#4B69FF] rounded-full flex items-center justify-center relative shrink-0">
                        <span className="text-white font-black text-2xl">O</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h4 className="text-[17px] font-black text-[#1D1D2B] truncate">{link.name}</h4>
                            <span className="text-[11px] font-bold text-gray-400">{link.date}</span>
                        </div>
                        <p className="text-[13px] font-bold text-gray-600 mt-0.5 truncate italic">
                            {link.url}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LinksList;
