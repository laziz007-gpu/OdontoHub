import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, X, Loader2, Check } from 'lucide-react';
import DentistImg from "../../assets/img/photos/Dentist.png";
import { useCreatePatient } from '../../api/profile';
import { toast } from '../Shared/Toast';

interface AddPatientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const AddPatientModal: React.FC<AddPatientModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatar, setAvatar] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '+998 ',
        birth_date: '',
        gender: '',
        address: ''
    });

    const createPatient = useCreatePatient();

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setAvatar(event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.full_name.trim() || !formData.phone.trim()) {
<<<<<<< HEAD
            alert(t('common.error'));
=======
            toast.warning('Пожалуйста, заполните обязательные поля');
>>>>>>> 5a553df4cba3528c9d0f8757cfab166f5ee26e83
            return;
        }

        try {
            await createPatient.mutateAsync({
                full_name: formData.full_name,
                phone: formData.phone.trim(),
                birth_date: formData.birth_date || undefined,
                gender: formData.gender || undefined,
                address: formData.address || undefined,
                source: 'doctor_added'
            });

            // Reset form
            setFormData({
                full_name: '',
                phone: '+998 ',
                birth_date: '',
                gender: '',
                address: ''
            });
            setAvatar(null);

            if (onSuccess) {
                onSuccess();
            }
        } catch (error: any) {
            console.error("Failed to create patient", error);
<<<<<<< HEAD
            const errorMessage = error.response?.data?.detail || t('common.error');
            alert(errorMessage);
=======
            const errorMessage = error.response?.data?.detail || "Ошибка при создании пациента";
            
            // Check if it's an authentication error
            if (error.response?.status === 401) {
                toast.error('Ошибка авторизации. Пожалуйста, войдите в систему снова.');
            } else {
                toast.error(errorMessage);
            }
>>>>>>> 5a553df4cba3528c9d0f8757cfab166f5ee26e83
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
                className="bg-white w-full max-w-2xl rounded-3xl relative shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">{t('common.patients.add_patient')}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Avatar Upload */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-3xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 group-hover:border-blue-300 transition-colors">
                                    <img
                                        src={avatar || DentistImg}
                                        alt="Patient avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute -bottom-2 -right-2 p-3 bg-blue-600 text-white rounded-2xl shadow-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Camera className="w-4 h-4" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="flex-1 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">
                                    {t('common.patients.full_name')} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    className="w-full h-12 bg-gray-50 border-2 border-transparent rounded-2xl px-4 text-base font-semibold focus:bg-white focus:border-blue-400 focus:outline-none transition-all"
                                    placeholder={t('common.patients.enter_name')}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">
                                        {t('common.patients.phone')} <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => {
                                            let val = e.target.value;
                                            if (!val.startsWith('+998 ')) {
                                                val = '+998 ' + val.replace(/^\+?998\s?/, '');
                                            }
                                            setFormData({ ...formData, phone: val });
                                        }}
                                        className="w-full h-12 bg-gray-50 border-2 border-transparent rounded-2xl px-4 text-base font-semibold focus:bg-white focus:border-blue-400 focus:outline-none transition-all"
                                        placeholder="+998 XX XXX XX XX"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">
                                        {t('common.patients.gender.title')}
                                    </label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        className="w-full h-12 bg-gray-50 border-2 border-transparent rounded-2xl px-4 text-base font-semibold focus:bg-white focus:border-blue-400 focus:outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">{t('common.patients.gender.title')}</option>
                                        <option value="male">{t('common.patients.gender.male')}</option>
                                        <option value="female">{t('common.patients.gender.female')}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">
                                        {t('common.patients.birth_date')}
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.birth_date}
                                        onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                                        onClick={(e) => ('showPicker' in HTMLInputElement.prototype) && e.currentTarget.showPicker()}
                                        className="w-full h-12 bg-gray-50 border-2 border-transparent rounded-2xl px-4 text-base font-semibold focus:bg-white focus:border-blue-400 focus:outline-none transition-all cursor-pointer"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">
                                        {t('common.patients.address')}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full h-12 bg-gray-50 border-2 border-transparent rounded-2xl px-4 text-base font-semibold focus:bg-white focus:border-blue-400 focus:outline-none transition-all"
                                        placeholder={t('common.patients.enter_address')}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex gap-4 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 px-6 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-[0.98]"
                        >
                            {t('common.patients.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={createPatient.isPending}
                            className="flex-1 py-4 px-6 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {createPatient.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                            {t('common.patients.save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPatientModal;
