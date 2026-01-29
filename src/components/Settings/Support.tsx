import React from 'react';
import OnlineSupport from '../../assets/img/icons/OnlineSupport.svg';
import FAQ from '../../assets/img/icons/FAQ.svg';
import PrivacyPolicy from '../../assets/img/icons/PrivacyPolicy.svg';
import About from '../../assets/img/icons/About.svg';

// Based on the image, the items look like buttons/links.
// The user provided image shows just the list.
// I'll implement them as a list of clickable items.

const Support: React.FC = () => {
    const items = [
        { icon: OnlineSupport, label: 'Связаться с поддержкой' },
        { icon: FAQ, label: 'FAQ' },
        { icon: PrivacyPolicy, label: 'Политика конфиденциальности' },
        { icon: About, label: 'О приложении' },
    ];

    return (
        <div className="flex flex-col gap-4">
            {items.map((item, index) => (
                <button
                    key={index}
                    className="w-full bg-white p-4 rounded-2xl flex items-center gap-4 hover:shadow-sm transition-shadow text-left group"
                >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 group-hover:bg-blue-50 transition-colors">
                        <img src={item.icon} alt={item.label} className="w-6 h-6" />
                    </div>
                    <span className="text-[#1E2532] font-bold flex-1">{item.label}</span>
                </button>
            ))}
        </div>
    );
};

export default Support;
