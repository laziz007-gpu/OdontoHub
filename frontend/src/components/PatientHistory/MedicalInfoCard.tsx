import { useTranslation } from "react-i18next";
import type { MedicalInfo } from "../../types/patient";

interface MedicalInfoCardProps {
    medicalInfo: MedicalInfo;
}

const MedicalInfoCard = ({ medicalInfo }: MedicalInfoCardProps) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-blue-900">{t("patient.history.medical_info", "Медицинская информация")}</h2>
            <div className="bg-gray-50 rounded-4xl p-6 md:p-10 space-y-6 border border-gray-100 shadow-sm">
                <div className="space-y-1">
                    <p className="text-[10px] md:text-xs uppercase font-black tracking-widest opacity-50">Аллергии:</p>
                    <p className="text-xl md:text-2xl font-bold text-red-500">{medicalInfo.allergy}</p>
                </div>
                <div className="space-y-1 border-t border-gray-100 pt-4">
                    <p className="text-[10px] md:text-xs uppercase font-black tracking-widest opacity-50">Хронические заболевания:</p>
                    <p className="text-xl md:text-2xl font-bold">{medicalInfo.chronicDisease}</p>
                </div>
                <div className="space-y-1 border-t border-gray-100 pt-4">
                    <p className="text-[10px] md:text-xs uppercase font-black tracking-widest opacity-50">Медикаменты:</p>
                    <p className="text-xl md:text-2xl font-bold">{medicalInfo.medication}</p>
                </div>
                <div className="space-y-1 border-t border-gray-100 pt-4">
                    <p className="text-[10px] md:text-xs uppercase font-black tracking-widest opacity-50">Противопоказания:</p>
                    <p className="text-xl md:text-2xl font-bold">{medicalInfo.contraindication}</p>
                </div>
                <div className="space-y-1 border-t border-gray-100 pt-4">
                    <p className="text-[10px] md:text-xs uppercase font-black tracking-widest opacity-50">Курение:</p>
                    <p className="text-xl md:text-2xl font-bold">{medicalInfo.smoking}</p>
                </div>
            </div>
        </div>
    );
};

export default MedicalInfoCard;
