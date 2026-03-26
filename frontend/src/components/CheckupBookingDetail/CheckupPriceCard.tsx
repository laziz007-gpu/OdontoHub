import React from 'react';

const CheckupPriceCard = () => {
    return (
        <div className="bg-[#4D71F8] rounded-[30px] p-6 md:p-8 w-full text-white shadow-lg flex flex-col justify-center">
            <p className="text-[18px] font-bold opacity-90 mb-0">цена:</p>
            <h2 className="text-[32px] md:text-[40px] font-bold leading-none">20.000сум</h2>
        </div>
    );
};

export default CheckupPriceCard;
