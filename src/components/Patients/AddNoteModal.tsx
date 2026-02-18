import React, { useState, useMemo, useRef, useEffect } from 'react';
import { X, Loader2, Search } from 'lucide-react';
import { useAllPatients } from '../../api/profile';

interface AddNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (patientId: number, note: string) => void;
}

const AddNoteModal: React.FC<AddNoteModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [selectedPatientId, setSelectedPatientId] = useState<number | ''>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [note, setNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { data: patients, isLoading: isLoadingPatients } = useAllPatients();

    const filteredPatients = useMemo(() => {
        if (!patients || !Array.isArray(patients)) return [];
        return patients.filter((p: any) =>
            p.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [patients, searchTerm]);

    const selectedPatientName = useMemo(() => {
        if (!selectedPatientId || !patients || !Array.isArray(patients)) return '';
        const patient = patients.find((p: any) => p.id === selectedPatientId);
        return patient?.full_name || '';
    }, [selectedPatientId, patients]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedPatientId || !note.trim()) {
            alert('Пожалуйста, выберите пациента и введите заметку');
            return;
        }

        setIsSubmitting(true);
        try {
            // Call onSuccess callback with patient ID and note
            onSuccess?.(selectedPatientId as number, note);
            
            // Reset form
            setSelectedPatientId('');
            setSearchTerm('');
            setNote('');
            onClose();
        } catch (error) {
            console.error("Failed to add note", error);
            alert("Ошибка при добавлении заметки");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-lg rounded-[28px] p-6 md:p-8 relative shadow-2xl animate-in zoom-in-95 duration-200"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-5 h-5 text-gray-400" />
                </button>

                <h2 className="text-2xl md:text-3xl font-black text-[#1a1f36] mb-6">
                    Новая заметка
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Patient Selection */}
                    <div className="relative" ref={dropdownRef}>
                        <label className="block text-sm font-bold text-gray-600 mb-2">
                            Пациент <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Выберите пациента"
                                value={isDropdownOpen ? searchTerm : selectedPatientName || searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setIsDropdownOpen(true);
                                    if (!e.target.value) {
                                        setSelectedPatientId('');
                                    }
                                }}
                                onFocus={() => setIsDropdownOpen(true)}
                                className="w-full h-12 bg-[#efefef] rounded-[16px] px-5 text-base font-bold text-[#1a1f36] border-none focus:ring-2 focus:ring-[#4f6bff]/20 outline-none"
                            />
                            {isLoadingPatients ? (
                                <Loader2 className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a1f36] animate-spin opacity-40" />
                            ) : (
                                <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a1f36] pointer-events-none opacity-40" />
                            )}
                        </div>

                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[20px] shadow-2xl border border-gray-100 z-[60] max-h-60 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
                                {filteredPatients.length > 0 ? (
                                    filteredPatients.map((p: any) => (
                                        <div
                                            key={p.id}
                                            onClick={() => {
                                                setSelectedPatientId(p.id);
                                                setSearchTerm('');
                                                setIsDropdownOpen(false);
                                            }}
                                            className="px-5 py-3 hover:bg-[#4f6bff]/10 cursor-pointer transition-colors flex items-center gap-3"
                                        >
                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-[#1a1f36]">
                                                {p.full_name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#1a1f36]">{p.full_name}</p>
                                                <p className="text-xs text-gray-400">{p.phone || 'Нет номера'}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-5 py-4 text-center text-gray-400 font-bold">
                                        Пациент не найден
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Note */}
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-2">
                            Заметка <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Введите заметку"
                            rows={5}
                            className="w-full bg-[#efefef] rounded-[16px] p-4 text-base font-bold text-[#1a1f36] border-none focus:ring-2 focus:ring-[#4f6bff]/20 outline-none resize-none"
                            required
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-gray-100 text-gray-600 text-base font-black rounded-[16px] hover:bg-gray-200 transition-all active:scale-[0.98]"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-3 bg-[#00e396] text-white text-base font-black rounded-[16px] shadow-lg shadow-[#00e396]/20 hover:bg-[#00d08a] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                            Добавить
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddNoteModal;
