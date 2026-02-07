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

            <div className="grid grid-cols-2 shrink-0 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {photos.map((photo, idx) => (
                    <div
                        key={idx}
                        onClick={() => setSelectedPhoto(photo || null)}
                        className="group relative aspect-square bg-[#e0e0e0] rounded-[20px] md:rounded-[24px] flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-all active:scale-95 overflow-hidden"
                    >
                        {photo ? (
                            <img src={photo} alt={`Patient photo ${idx + 1}`} className="w-full h-full object-cover" />
                        ) : (
                            <ImageIcon className="w-8 h-8 md:w-12 md:h-12 text-gray-500 opacity-50 group-hover:scale-110 transition-transform" />
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                    </div>
                ))}
            </div>

            {/* Add Button */}
            <button
                onClick={handleAddPhoto}
                className="fixed bottom-6 right-6 md:bottom-12 md:right-12 w-14 h-14 md:w-16 md:h-16 bg-[#5377f7] text-white rounded-full flex items-center justify-center shadow-xl shadow-blue-500/30 hover:bg-blue-600 hover:scale-110 transition-all active:scale-95 z-20"
            >
                <Plus className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            {/* Photo Preview Modal */}
            {selectedPhoto && (
                <div
                    onClick={() => setSelectedPhoto(null)}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
                >
                    <div className="relative max-w-5xl w-full max-h-[90vh] bg-[#e0e0e0] rounded-[24px] md:rounded-[40px] flex items-center justify-center overflow-hidden">
                        <button
                            onClick={(e) => { e.stopPropagation(); setSelectedPhoto(null); }}
                            className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-colors z-10"
                        >
                            <X className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                        <img
                            src={selectedPhoto}
                            alt="Selected preview"
                            className="w-full h-full object-contain max-h-[85vh]"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PhotoGrid;
