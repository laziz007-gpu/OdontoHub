import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useCreatePatient } from '../../api/profile';

interface AddPatientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const AddPatientModal: React.FC<AddPatientModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        birth_date: '',
        gender: '',
        address: ''
    });

    const createPatient = useCreatePatient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.full_name.trim() || !formData.phone.trim()) {
            alert('Пожалуйста, заполните обязательные поля');
            return;
        }

        try {
            await createPatient.mutateAsync({
                full_name: formData.full_name,
                phone: formData.phone,
                birth_date: formData.birth_date || undefined,
                gender: formData.gender || undefined,
                address: formData.address || undefined,
                source: 'doctor_added'
            });
            
            // Reset form
            setFormData({
                full_name: '',
                phone: '',
                birth_date: '',
                gender: '',
                address: ''
            });
            
            // Call onSuccess to close modal and trigger any parent updates
            if (onSuccess) {
                onSuccess();
            }
        } catch (error: any) {
            console.error("Failed to create patient", error);
            const errorMessage = error.response?.data?.detail || "Ошибка при создании пациента";
            
            // Check if it's an authentication error
            if (error.response?.status === 401) {
                alert('Ошибка авторизации. Пожалуйста, войдите в систему снова.');
            } else {
                alert(errorMessage);
            }
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
                className="bg-white w-full max-w-md rounded-[28px] p-6 md:p-8 relative shadow-2xl animate-in zoom-in-95 duration-200"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-5 h-5 text-gray-400" />
                </button>

                <h2 className="text-2xl md:text-3xl font-black text-[#1a1f36] mb-6">
                    Добавить пациента
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-2">
                            ФИО <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            placeholder="Введите полное имя"
                            className="w-full h-12 bg-[#efefef] rounded-[16px] px-5 text-base font-bold text-[#1a1f36] border-none focus:ring-2 focus:ring-[#4f6bff]/20 outline-none"
                            required
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-2">
                            Номер телефона <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+998 XX XXX XX XX"
                            className="w-full h-12 bg-[#efefef] rounded-[16px] px-5 text-base font-bold text-[#1a1f36] border-none focus:ring-2 focus:ring-[#4f6bff]/20 outline-none"
                            required
                        />
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-2">
                            Пол
                        </label>
                        <select
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            className="w-full h-12 bg-[#efefef] rounded-[16px] px-5 text-base font-bold text-[#1a1f36] border-none focus:ring-2 focus:ring-[#4f6bff]/20 outline-none"
                        >
                            <option value="">Выберите пол</option>
                            <option value="male">Мужской</option>
                            <option value="female">Женский</option>
                        </select>
                    </div>

                    {/* Birth Date */}
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-2">
                            Дата рождения
                        </label>
                        <input
                            type="date"
                            value={formData.birth_date}
                            onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                            className="w-full h-12 bg-[#efefef] rounded-[16px] px-5 text-base font-bold text-[#1a1f36] border-none focus:ring-2 focus:ring-[#4f6bff]/20 outline-none"
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-2">
                            Адрес
                        </label>
                        <textarea
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Введите адрес"
                            rows={2}
                            className="w-full bg-[#efefef] rounded-[16px] px-5 py-3 text-base font-bold text-[#1a1f36] border-none focus:ring-2 focus:ring-[#4f6bff]/20 outline-none resize-none"
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
                            disabled={createPatient.isPending}
                            className="flex-1 py-3 bg-[#00e396] text-white text-base font-black rounded-[16px] shadow-lg shadow-[#00e396]/20 hover:bg-[#00d08a] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {createPatient.isPending && <Loader2 className="w-5 h-5 animate-spin" />}
                            Добавить
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPatientModal;
