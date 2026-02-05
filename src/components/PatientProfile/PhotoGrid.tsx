import React, { useState, useRef } from 'react';
import { Plus, Image as ImageIcon, X } from 'lucide-react';

interface PhotoGridProps {
    patientId?: string;
}

const PhotoGrid: React.FC<PhotoGridProps> = () => {
    // Initial mock photos
    const [photos, setPhotos] = useState<string[]>(Array(10).fill(''));
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAddPhoto = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            // Prepend the new photo to the existing list (keeping placeholders)
            setPhotos([url, ...photos]);
        }
    };

    return (
        <div className="relative">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {photos.map((photo, idx) => (
                    <div
                        key={idx}
                        onClick={() => setSelectedPhoto(photo || null)}
                        className="group relative aspect-square bg-[#e0e0e0] rounded-[24px] flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-all active:scale-95 overflow-hidden"
                    >
                        {photo ? (
                            <img src={photo} alt={`Patient photo ${idx + 1}`} className="w-full h-full object-cover" />
                        ) : (
                            <ImageIcon className="w-12 h-12 text-gray-500 opacity-50 group-hover:scale-110 transition-transform" />
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                    </div>
                ))}
            </div>

            {/* Add Button */}
            <button
                onClick={handleAddPhoto}
                className="fixed bottom-12 right-12 w-16 h-16 bg-[#5377f7] text-white rounded-full flex items-center justify-center shadow-xl shadow-blue-500/30 hover:bg-blue-600 hover:scale-110 transition-all active:scale-95 z-10"
            >
                <Plus className="w-8 h-8" />
            </button>

            {/* Photo Preview Modal */}
            {selectedPhoto && (
                <div
                    onClick={() => setSelectedPhoto(null)}
                    className="fixed inset-0 z-60 flex items-center justify-center p-8 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
                >
                    <div className="relative max-w-4xl w-full aspect-video bg-[#e0e0e0] rounded-[40px] flex items-center justify-center overflow-hidden">
                        <button
                            onClick={() => setSelectedPhoto(null)}
                            className="absolute top-6 right-6 w-12 h-12 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        {selectedPhoto === 'placeholder' ? (
                            <ImageIcon className="w-32 h-32 text-gray-400" />
                        ) : (
                            <img src={selectedPhoto} alt="Selected preview" className="w-full h-full object-contain" />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PhotoGrid;
