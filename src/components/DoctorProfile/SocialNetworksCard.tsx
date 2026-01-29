import React, { type FC, type ReactNode } from 'react';
import { Send, Instagram, Facebook, Phone } from 'lucide-react';

interface SocialLinkProps {
    icon: ReactNode;
    label: string;
}

const SocialLink: FC<SocialLinkProps> = ({ icon, label }) => (
    <div className="flex items-center gap-4 bg-[#F5F7FA] p-2 rounded-[20px] border border-gray-50 hover:border-gray-200 transition-colors">
        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0">
            {icon}
        </div>
        <span className="font-bold text-xs text-gray-700 truncate">{label}</span>
    </div>
);

interface SocialLinkItem {
    icon: ReactNode;
    label: string;
}

const SocialNetworksCard: FC = () => {
    const socialLinks: SocialLinkItem[] = [
        { icon: <Send className="w-5 h-5 text-sky-500 fill-sky-500" />, label: '@stom' },
        { icon: <Instagram className="w-5 h-5 text-pink-500" />, label: 'stomatolog.uz' },
        { icon: <Facebook className="w-5 h-5 text-blue-600 fill-blue-600" />, label: 'stomatolog.uz' },
    ];

    return (
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50">
            <h3 className="text-2xl font-bold text-[#1E2532] mb-8">Соц.сети</h3>
            <div className="space-y-4">
                {socialLinks.map((link, i) => (
                    <SocialLink key={i} icon={link.icon} label={link.label} />
                ))}
                <SocialLink
                    icon={<Phone className="w-5 h-5 text-emerald-500" />}
                    label="+998 90 123 45 67"
                />
            </div>
        </div>
    );
};

export default SocialNetworksCard;
