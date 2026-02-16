import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

interface XRaySectionProps {
    xrayImages: (string | null)[];
}

const XRaySection = ({ xrayImages }: XRaySectionProps) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-blue-900">{t("patient.history.xray", "Рентген снимок")}</h2>
                <button className="text-lg font-bold text-blue-600 opacity-70 hover:opacity-100 transition-opacity underline decoration-dotted">ещё</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pb-20">
                {xrayImages.map((image, idx) => (
                    <div key={idx} className="aspect-square bg-gray-50 rounded-4xl border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center text-xs font-bold text-gray-400 group hover:border-blue-300 hover:text-blue-500 transition-all">
                        {image ? (
                            <img src={image} alt={`X-ray ${idx + 1}`} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-center px-4 uppercase tracking-tighter">Снимок {idx + 1}</span>
                        )}
                    </div>
                ))}
                <button className="aspect-square bg-blue-50 rounded-4xl flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-all active:scale-95 border-2 border-blue-100 shadow-sm">
                    <Plus size={48} strokeWidth={4} />
                </button>
            </div>
        </div>
    );
};

export default XRaySection;
