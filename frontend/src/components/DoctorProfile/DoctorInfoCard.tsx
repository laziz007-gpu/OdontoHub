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
        <div className="w-full h-[185px] bg-[#5B7FFF] rounded-[24px] p-6 text-white flex items-center gap-5 shadow-sm">
            <div
                onClick={onAvatarClick}
                className="w-[120px] h-[120px] rounded-[18px] overflow-hidden border-2 border-white/20 shrink-0 relative group cursor-pointer"
            >
                <img src={avatar || DentistImg} alt="Doctor" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-bold text-center px-2">Изменить фото</span>
                </div>
            </div>
            <div>
                <h2 className="text-xl font-bold mb-3 tracking-tight">{name}</h2>
                <div className="space-y-0.5 text-[13px] text-blue-50">
                    <p>{t('patient_profile.gender')}: <span className="text-white font-medium">{gender}</span></p>
                    <p>{t('patient_profile.age')}: <span className="text-white font-medium">{age}</span></p>
                    <p>Специализация: <span className="text-white font-medium">{specialization}</span></p>
                </div>
            </div>
        </div>
    );
};

export default DoctorInfoCard;
