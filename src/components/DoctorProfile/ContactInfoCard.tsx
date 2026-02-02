import React, { type FC, type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Phone,
    Mail,
    MapPin,
    GraduationCap,
    Building2,
    Edit2,
} from 'lucide-react';
import EditProfileModal from './EditProfileModal';

/* ================= TYPES ================= */

interface ContactItemProps {
    icon: ReactNode;
    label: string;
    value: string;
}

interface ContactData {
    phone: string;
    email: string;
    address: string;
    education: string;
    clinic: string;
    specialization: string;
    telegram: string;
    instagram: string;
    whatsapp: string;
    schedule: string;
    workStart: string;
    startMinute: string;
    workEnd: string;
    endMinute: string;
}

/* ================= COMPONENTS ================= */

const ContactItem: FC<ContactItemProps> = ({ icon, label, value }) => (
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

/* ================= MAIN CARD ================= */

interface ContactInfoCardProps {
    data: ContactData;
    onSave: (newData: Partial<ContactData>) => void;
}

const ContactInfoCard: FC<ContactInfoCardProps> = ({ data, onSave }) => {
    const { t } = useTranslation();
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

    const handleSave = (newData: Partial<ContactData>): void => {
        onSave(newData);
        setIsEditModalOpen(false);
    };

    return (
        <>
            <div className="w-full lg:w-[517px] h-[195px] bg-white rounded-[24px] p-4 shadow-sm border border-gray-100 relative flex flex-col justify-center">
                {/* Contact Items */}
                <div className="grid grid-cols-1 gap-y-2 pr-8">
                    <ContactItem
                        icon={<Phone className="w-3.5 h-3.5 text-gray-400" />}
                        label={t('doctor_profile.phone_number')}
                        value={data.phone}
                    />
                    <ContactItem
                        icon={<Mail className="w-3.5 h-3.5 text-gray-400" />}
                        label={t('doctor_profile.email')}
                        value={data.email}
                    />
                    <ContactItem
                        icon={<MapPin className="w-3.5 h-3.5 text-gray-400" />}
                        label={t('doctor_profile.address')}
                        value={data.address}
                    />
                    <ContactItem
                        icon={<GraduationCap className="w-3.5 h-3.5 text-gray-400" />}
                        label={t('doctor_profile.education')}
                        value={data.education}
                    />
                    <ContactItem
                        icon={<Building2 className="w-3.5 h-3.5 text-gray-400" />}
                        label={t('doctor_profile.clinic')}
                        value={data.clinic}
                    />
                </div>

                {/* Edit Button */}
                <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="absolute bottom-4 right-4 bg-[#5B7FFF] text-white pl-3 pr-1.5 py-1.5 rounded-full text-[10.5px] font-bold flex items-center gap-1.5 hover:bg-blue-600 transition-all shadow-md group"
                >
                    {t('doctor_profile.edit')}
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                        <Edit2 className="w-2 h-2 text-[#5B7FFF]" />
                    </div>
                </button>
            </div>

            {/* Modal */}
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                initialData={data}
                onSave={handleSave}
            />
        </>
    );
};

export default ContactInfoCard;
