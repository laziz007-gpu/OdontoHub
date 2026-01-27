import React from 'react';
import { ArrowRight, Edit2 } from 'lucide-react';

const ServicesSection: React.FC = () => {
    const services = [
        { name: 'Имплантация', price: '2.500.000', currency: 'сум', edit: true },
        { name: 'Удаление', price: '250.000', currency: 'сум', edit: false },
        { name: 'Периостотомия', price: '300.000', currency: 'сум', edit: false },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-5">
                <h3 className="text-2xl font-bold text-[#1E2532]">Мои услуги</h3>
                <button className="flex items-center gap-1.5 bg-[#5B7FFF] text-white px-4 py-1.5 rounded-full text-[11px] font-bold hover:bg-blue-600 transition-all">
                    Все
                    <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                        <ArrowRight className="w-2.5 h-2.5 text-blue-600 rotate-[-45deg]" strokeWidth={3} />
                    </div>
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {services.map((service, i) => (
                    <div key={i} className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-50 relative group">
                        <h4 className="font-bold text-[#5B7FFF] text-lg mb-6 leading-tight">{service.name}</h4>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black text-[#5B7FFF]">{service.price}</span>
                            <span className="text-[10px] text-[#5B7FFF] font-medium">{service.currency}</span>
                        </div>
                        {service.edit && (
                            <button className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-[#5B7FFF] text-white rounded-full shadow-lg opacity-100 group-hover:bg-blue-600 transition-all">
                                <Edit2 className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServicesSection;
