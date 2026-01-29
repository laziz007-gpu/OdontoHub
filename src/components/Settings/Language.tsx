
import React, { useState } from 'react';
import Uzb from "../../assets/img/photos/Uzb.png";
import Rus from "../../assets/img/photos/Rus.png";
import Kaz from "../../assets/img/photos/Qaz.png";
import Eng from "../../assets/img/photos/Eng.png";

const Language = () => {
    const [selected, setSelected] = useState('ru');

    const languages = [
        { id: 'uz', label: "O'zbek tili", icon: Uzb },
        { id: 'ru', label: "Русский язык", icon: Rus },
        { id: 'kz', label: "Қазақ тілі", icon: Kaz },
        { id: 'en', label: "English", icon: Eng },
    ];

    return (
        <div className="">
            <h4 className="text-[#1A1F36] text-[20px] font-bold mb-4">
                Выберите язык интерфейса
            </h4>

            <div className="flex flex-col gap-3">
                {languages.map((lang) => (
                    <div
                        key={lang.id}
                        onClick={() => setSelected(lang.id)}
                        className={`w-[330px] h-[49px] border rounded-2xl flex items-center gap-3 px-4 cursor-pointer transition-all duration-200 ${selected === lang.id
                                ? 'bg-[#4868FD] border-[#4868FD] text-white shadow-md'
                                : 'bg-white border-[#E6E8EC] text-[#1A1F36] hover:bg-[#F4F5FA]'
                            }`}
                    >
                        <img src={lang.icon} alt={lang.label} className="w-[38px] h-[19px]" />
                        <span className="text-[16px] font-medium">
                            {lang.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Language;
