const ActionButtons = () => {
    return (
        <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5">
            <div className="flex gap-3 sm:gap-4 lg:gap-5">
                <button className="flex-1 bg-[#11D76A] text-white py-3 sm:py-4 lg:py-5 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] text-sm sm:text-base lg:text-2xl font-bold shadow-lg shadow-green-500/20 hover:bg-[#0fc460] transition-all active:scale-95">
                    Связаться
                </button>
                <button className="flex-1 bg-[#FBBC05] text-white py-3 sm:py-4 lg:py-5 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] text-sm sm:text-base lg:text-2xl font-bold shadow-lg shadow-yellow-500/20 hover:bg-[#e0a800] transition-all active:scale-95">
                    Перенести
                </button>
            </div>
            <button className="w-full bg-[#EA4335] text-white py-3 sm:py-4 lg:py-5 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] text-sm sm:text-base lg:text-2xl font-bold shadow-lg shadow-red-500/20 hover:bg-[#d63b2f] transition-all active:scale-95">
                Отмененить
            </button>
        </div>
    );
};

export default ActionButtons;
