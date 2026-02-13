import { useTranslation } from "react-i18next";
import type { Treatment } from "../../types/patient";

interface TreatmentsTableProps {
    treatments: Treatment[];
}

const TreatmentsTable = ({ treatments }: TreatmentsTableProps) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-blue-900">{t("patient.history.treatments", "Лечения")}</h2>
            <div className="bg-white rounded-4xl border border-gray-100 shadow-md overflow-hidden">
                <div className="divide-y divide-gray-50">
                    {treatments.map((treatment, idx) => (
                        <div key={idx} className="p-4 md:p-6 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                            <div className="flex-1 grid grid-cols-3 items-center">
                                <p className="text-sm md:text-xl font-bold text-gray-900">{treatment.name}</p>
                                <p className="text-sm md:text-xl font-bold text-gray-500 text-center">{treatment.dateRange}</p>
                                <p className="text-sm md:text-xl font-bold text-blue-600 text-right">{treatment.appointmentsCount}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-6 pt-2">
                    <button className="w-full bg-blue-600 text-white py-4 rounded-3xl font-black text-xl hover:bg-blue-700 transition-all active:scale-[0.98] shadow-[0_10px_20px_rgba(37,99,235,0.2)]">
                        Перейти
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TreatmentsTable;
