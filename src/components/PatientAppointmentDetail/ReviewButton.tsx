import React from 'react';

const ReviewButton = () => {
    return (
        <div className="space-y-4">
            <div className="flex justify-between gap-4">
                <button className='w-[200px] h-[56px] bg-[#11D76A] rounded-[16px] text-center text-white text-[20px] font-bold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200'>
                    Связаться
                </button>
                <button className="w-[200px] h-[56px] bg-[#F8BD00] rounded-[16px] text-center text-white text-[20px] font-bold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200">
                    Перенести
                </button>
            </div>
            <div className="flex justify-center">
                <button className="w-full h-[56px] border-2 bg-[#E33629] text-white rounded-[16px] text-[20px] font-semibold hover:bg-red-50 active:bg-red-100 transition-all duration-200">
                    Отменить
                </button>
            </div>
        </div>
    );
};

export default ReviewButton;