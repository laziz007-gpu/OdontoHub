import React from 'react';

interface PriceCardProps {
    price: string;
}

const PriceCard: React.FC<PriceCardProps> = ({ price }) => {
    return (
        <div className="bg-[#4D71F8] rounded-[2rem] p-6 md:p-8 text-white shadow-lg">
            <p className="text-lg md:text-xl font-bold opacity-90 mb-1">цена:</p>
            <h2 className="text-3xl md:text-4xl font-bold">{price}</h2>
        </div>
    );
};

export default PriceCard;
