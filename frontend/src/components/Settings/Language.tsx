import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Uzb from '../../assets/img/photos/Uzb.png';
import Rus from '../../assets/img/photos/Rus.png';
import Kaz from '../../assets/img/photos/Qaz.png';
import Eng from '../../assets/img/photos/Eng.png';

const Language = () => {
    const { t, i18n } = useTranslation();
    const [selected, setSelected] = useState(i18n.language);

    const changeLanguage = (lang: string) => {
        setSelected(lang);
        i18n.changeLanguage(lang);
        localStorage.setItem('appLanguage', lang);
    };

    const languages = [
        { id: 'uz', label: "O'zbek tili", icon: Uzb },
        { id: 'ru', label: 'Р СѓСЃСЃРєРёР№ СЏР·С‹Рє', icon: Rus },
        { id: 'kz', label: 'ТљР°Р·Р°Т› С‚С–Р»С–', icon: Kaz },
        { id: 'en', label: 'English', icon: Eng },
    ];

    return (
        <div className="rounded-[28px] border border-[#e6ebff] bg-white p-6 shadow-sm">
            <h4 className="mb-2 text-[20px] font-bold text-[#1A1F36]">
                {t('settings.language_title')}
            </h4>
            <p className="mb-5 text-sm text-[#7a84a8]">
                Выберите язык интерфейса для всей платформы.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
                {languages.map((lang) => (
                    <button
                        key={lang.id}
                        type="button"
                        onClick={() => changeLanguage(lang.id)}
                        className={`flex min-h-[64px] items-center gap-3 rounded-2xl border px-4 text-left transition-all duration-200 ${
                            selected === lang.id
                                ? 'border-[#4868FD] bg-[#4868FD] text-white shadow-md'
                                : 'border-[#E6E8EC] bg-white text-[#1A1F36] hover:bg-[#F4F5FA]'
                        }`}
                    >
                        <img src={lang.icon} alt={lang.label} className="h-[19px] w-[38px]" />
                        <span className="text-[16px] font-medium">
                            {lang.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Language;
