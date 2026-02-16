import { type FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, ImageIcon } from 'lucide-react';

interface WorksSectionProps {
    works: string[];
    onAddWork: (url: string) => void;
}

const WorksSection: FC<WorksSectionProps> = ({ works, onAddWork }) => {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            onAddWork(url);
            // Reset input value to allow selecting the same file again
            e.target.value = '';
        }
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    // Show placeholders for remaining slots (up to 6 total)
    const placeholderCount = Math.max(0, 6 - works.length);

    return (
        <div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />

            <div className="flex justify-between items-center mb-5">
                <h3 className="text-2xl font-bold text-[#1E2532]">{t('doctor_profile.my_works')}</h3>
                <button
                    onClick={triggerFileUpload}
                    className="flex items-center gap-1.5 bg-[#5B7FFF] text-white px-4 py-1.5 rounded-full text-[11px] font-bold hover:bg-blue-600 transition-all"
                >
                    {t('doctor_profile.add')}
                    <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                        <Plus className="w-2.5 h-2.5 text-blue-600" strokeWidth={4} />
                    </div>
                </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {/* Render uploaded images */}
                {works.map((imageUrl, index) => (
                    <div
                        key={index}
                        className="aspect-square bg-gray-200 rounded-[24px] relative overflow-hidden group cursor-pointer border border-gray-100"
                    >
                        <img
                            src={imageUrl}
                            alt={`Work ${index + 1}`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                    </div>
                ))}

                {/* Render placeholders for empty slots */}
                {Array.from({ length: placeholderCount }).map((_, i) => (
                    <div
                        key={`placeholder-${i}`}
                        onClick={triggerFileUpload}
                        className="aspect-square bg-gray-200 rounded-[24px] flex items-center justify-center relative overflow-hidden group hover:bg-gray-300 transition-all cursor-pointer border border-gray-100"
                    >
                        <div className="w-12 h-12 flex items-center justify-center opacity-40 group-hover:scale-110 transition-transform">
                            <ImageIcon className="w-10 h-10 text-gray-500" strokeWidth={1} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorksSection;
