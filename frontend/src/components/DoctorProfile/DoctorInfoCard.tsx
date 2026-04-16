import { type FC } from 'react';
import DentistImg from '../../assets/img/photos/Dentist.png';
import { useTranslation } from 'react-i18next';

interface DoctorInfoCardProps {
    name: string;
    gender: string;
    age: string;
    specialization: string;
    avatar?: string;
    onAvatarClick?: () => void;
}

const DoctorInfoCard: FC<DoctorInfoCardProps> = ({ name, gender, age, specialization, avatar, onAvatarClick }) => {
    const { t } = useTranslation();
    return (
        <div className="flex w-full flex-col gap-4 rounded-[24px] bg-[#5B7FFF] p-4 text-white shadow-sm sm:flex-row sm:items-center sm:gap-5 sm:p-6">
            <div
                onClick={onAvatarClick}
                className="relative h-24 w-24 shrink-0 cursor-pointer overflow-hidden rounded-[18px] border-2 border-white/20 group self-center sm:h-[120px] sm:w-[120px] sm:self-auto"
            >
                <img src={avatar || DentistImg} alt="Doctor" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-bold text-center px-2">{t('doctor_profile.change_photo')}</span>
                </div>
            </div>
            <div className="min-w-0 text-center sm:text-left">
                <h2 className="mb-3 break-words text-lg font-bold tracking-tight sm:text-xl">{name}</h2>
                <div className="space-y-1 text-xs text-blue-50 sm:text-[13px]">
                    <p>{t('patient_profile.gender')}: <span className="text-white font-medium">{gender}</span></p>
                    <p>{t('patient_profile.age')}: <span className="text-white font-medium">{age}</span></p>
                    <p className="break-words">{t('doctor_profile.specialization_label')}: <span className="text-white font-medium">{specialization}</span></p>
                </div>
            </div>
        </div>
    );
};

export default DoctorInfoCard;
