import { useTranslation } from "react-i18next";

interface PrescriptionCardProps {
    prescriptions: string[];
}

const PrescriptionCard = ({ prescriptions }: PrescriptionCardProps) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-blue-900">{t("patient.history.prescription", "Рецепт")}</h2>
            <div className="bg-blue-50 rounded-4xl p-8 space-y-4 border border-blue-100 shadow-sm">
                {prescriptions.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                        <div className="w-3 h-3 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.3)]" />
                        <p className="text-xl md:text-2xl font-bold text-blue-800">{item}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PrescriptionCard;
