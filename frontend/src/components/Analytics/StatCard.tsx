import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
    unit?: string;
    trend?: {
        value: string;
        label: string;
        isPositive: boolean;
    };
    actionButton?: {
        label: string;
        onClick: () => void;
    };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, unit, trend, actionButton }) => {
    return (
        <div className="bg-white rounded-[32px] p-8 shadow-sm h-full relative overflow-hidden">
            <h3 className="text-gray-900 font-bold text-xl mb-6">{title}</h3>

            <div className="flex items-baseline gap-1 mb-2">
                <span className="text-[64px] font-bold text-[#1e2235] leading-none">{value}</span>
                {unit && <span className="text-2xl font-bold text-[#1e2235]">{unit}</span>}
            </div>

            {trend && (
                <div className="flex items-center gap-1.5 text-lg font-medium">
                    <span className={trend.isPositive ? 'text-[#1cdb6f]' : 'text-red-500'}>
                        {trend.isPositive ? '+' : ''}{trend.value}
                    </span>
                    <span className="text-gray-400">{trend.label}</span>
                </div>
            )}

            {actionButton && (
                <button
                    onClick={actionButton.onClick}
                    className="mt-4 bg-[#5377f7] text-white px-8 py-2.5 rounded-2xl font-semibold hover:bg-blue-600 transition-colors"
                >
                    {actionButton.label}
                </button>
            )}
        </div>
    );
};

export default StatCard;
