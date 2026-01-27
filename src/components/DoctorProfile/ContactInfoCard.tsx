import React from 'react';
import { Phone, Mail, MapPin, GraduationCap, Building2, Edit2 } from 'lucide-react';

const ContactItem = ({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) => (
    <div className="flex items-center gap-2.5">
        {/* Icon */}
        <div className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
            {icon}
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
            <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-3 mb-0.5">
                {label}
            </span>
            <p className="text-[10.5px] font-bold text-[#1E2532] leading-3 truncate">
                {value}
            </p>
        </div>
    </div>
);

const ContactInfoCard: React.FC = () => {
    return (
        <div className="w-full lg:w-[517px] h-[195px] bg-white rounded-[24px] p-4 shadow-sm border border-gray-100 relative flex flex-col justify-center">

            {/* Contact Items Layout */}
            <div className="grid grid-cols-1 gap-y-2 pr-8">
                <ContactItem
                    icon={<Phone className="w-3.5 h-3.5 text-gray-400" />}
                    label="Тел.номер"
                    value="+998 (93) 123 45 67"
                />
                <ContactItem
                    icon={<Mail className="w-3.5 h-3.5 text-gray-400" />}
                    label="Email"
                    value="example@gmail.com"
                />
                <ContactItem
                    icon={<MapPin className="w-3.5 h-3.5 text-gray-400" />}
                    label="Адрес"
                    value="ул. Амира Темура, 11кв, 20дом"
                />
                <ContactItem
                    icon={<GraduationCap className="w-3.5 h-3.5 text-gray-400" />}
                    label="Образование"
                    value="ТашПМИ(Факультет)"
                />
                <ContactItem
                    icon={<Building2 className="w-3.5 h-3.5 text-gray-400" />}
                    label="Клиника"
                    value="Не указано"
                />
            </div>

            {/* Edit Button */}
            <button className="absolute bottom-4 right-4 bg-[#5B7FFF] text-white pl-3 pr-1.5 py-1.5 rounded-full text-[10.5px] font-bold flex items-center gap-1.5 hover:bg-blue-600 transition-all shadow-md group">
                Редактировать
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                    <Edit2 className="w-2 h-2 text-[#5B7FFF]" />
                </div>
            </button>
        </div>
    );
};

export default ContactInfoCard;