import React from 'react';
import { Plus, Edit2 } from 'lucide-react';

const ScheduleCard: React.FC = () => {
    return (
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50">
            <h3 className="text-2xl font-bold text-[#1E2532] mb-8">График работы</h3>

            <div className="space-y-8">
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-[#1E2532] text-sm">Каждый день</span>
                        <button className="w-8 h-8 bg-[#F5F8FF] rounded-full flex items-center justify-center hover:bg-blue-50 transition-colors">
                            <Plus className="w-3.5 h-3.5 text-[#5B7FFF]" strokeWidth={3} />
                        </button>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="flex-1 bg-[#F5F7FA] py-4 rounded-[20px] text-center font-bold text-[#1E2532] text-lg border border-gray-100">
                            09:00-19:00
                        </div>
                        <button className="w-10 h-10 bg-[#F5F8FF] rounded-[14px] flex items-center justify-center hover:bg-blue-50 transition-colors">
                            <Edit2 className="w-4 h-4 text-[#5B7FFF]" />
                        </button>
                    </div>
                </div>

                <div>
                    <span className="font-bold text-[#1E2532] text-sm mb-4 block">Выходные дни</span>
                    <button className="w-full bg-[#5B7FFF] text-white py-4 rounded-[22px] font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-600 transition-all">
                        <Plus className="w-4 h-4" strokeWidth={3} /> Добавить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleCard;
