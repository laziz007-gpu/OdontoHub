const ActionButtons = () => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-4">
                <button className="flex-1 bg-[#11D76A] text-white py-4 rounded-[20px] text-[18px] md:text-[20px] font-bold shadow-lg shadow-green-500/20 hover:bg-[#0fc460] transition-colors">
                    Связаться
                </button>
                <button className="flex-1 bg-[#FBBC05] text-white py-4 rounded-[20px] text-[18px] md:text-[20px] font-bold shadow-lg shadow-yellow-500/20 hover:bg-[#e0a800] transition-colors">
                    Перенести
                </button>
            </div>
            <button className="w-full bg-[#EA4335] text-white py-4 rounded-[20px] text-[18px] md:text-[20px] font-bold shadow-lg shadow-red-500/20 hover:bg-[#d63b2f] transition-colors">
                Отмененить
            </button>
        </div>
    );
};

export default ActionButtons;
