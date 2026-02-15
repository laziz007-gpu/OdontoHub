import { type FC, useState, useEffect } from 'react';
import DentistImg from '../../assets/img/photos/Dentist.png';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
    onSave: (data: any) => void;
    avatar?: string;
    triggerAvatarUpload?: () => void;
}

const EditProfileModal: FC<EditProfileModalProps> = ({ isOpen, onClose, initialData, onSave, avatar, triggerAvatarUpload }) => {
    const [formData, setFormData] = useState(initialData || {});

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData(initialData);
        }
    }, [isOpen, initialData]);

    const handleChange = (field: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center md:p-4 lg:p-8">
            <div className="bg-[#EEF2FF] w-full h-full md:h-auto md:max-h-[90vh] md:max-w-[600px] lg:max-w-[500px] md:rounded-[40px] md:shadow-2xl overflow-hidden flex flex-col relative animate-in fade-in zoom-in duration-300">
                <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar pb-10">
                    {/* Header */}
                    <div className="flex items-center justify-center relative py-6 px-4">
                        <button
                            onClick={onClose}
                            className="absolute left-6 top-1/2 -translate-y-1/2"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#1D1D2B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <h2 className="text-2xl md:text-3xl font-black text-[#1D1D2B]">Профиль</h2>
                    </div>

                    {/* Avatar Section */}
                    <div className="flex flex-col items-center gap-6 px-6 mb-10 mt-4">
                        <div className="flex flex-row items-center gap-6 w-full justify-center">
                            <div className="w-[140px] h-[140px] rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200">
                                <img
                                    src={avatar || DentistImg}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={triggerAvatarUpload}
                                    className="bg-white text-[#4D71F8] font-bold py-3 px-8 rounded-[20px] shadow-sm hover:shadow-md transition-all active:scale-95 text-sm"
                                >
                                    Изменить фото
                                </button>
                                <button
                                    className="bg-white text-red-600 font-bold py-3 px-8 rounded-[20px] shadow-sm hover:shadow-md transition-all active:scale-95 text-sm"
                                >
                                    Удалить фото
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="px-6 space-y-6">
                        {/* F.I.O. */}
                        <div className="space-y-2">
                            <label className="text-[14px] font-black text-[#1D1D2B] px-4">Ф.И.О.</label>
                            <input
                                type="text"
                                value={formData.name || ''}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="w-full bg-[#D9D9D9] border-none rounded-[20px] py-4 px-6 text-lg font-black text-[#1D1D2B] focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>

                        {/* Birth Date */}
                        <div className="space-y-2">
                            <label className="text-[14px] font-black text-[#1D1D2B] px-4">Дата рождения</label>
                            <input
                                type="text"
                                value={formData.age || '20.09.2000'}
                                onChange={(e) => handleChange('age', e.target.value)}
                                className="w-full bg-[#D9D9D9] border-none rounded-[20px] py-4 px-6 text-lg font-black text-[#1D1D2B] focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <label className="text-[14px] font-black text-[#1D1D2B] px-4">Номер телефона</label>
                            <input
                                type="text"
                                value={formData.phone || ''}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                className="w-full bg-[#D9D9D9] border-none rounded-[20px] py-4 px-6 text-lg font-black text-[#1D1D2B] focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>

                        {/* Region */}
                        <div className="space-y-2">
                            <label className="text-[14px] font-black text-[#1D1D2B] px-4">Регион</label>
                            <input
                                type="text"
                                value={formData.address || 'г. Ташкент'}
                                onChange={(e) => handleChange('address', e.target.value)}
                                className="w-full bg-[#D9D9D9] border-none rounded-[20px] py-4 px-6 text-lg font-black text-[#1D1D2B] focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>

                        {/* Confirmation */}
                        <div className="space-y-2">
                            <label className="text-[14px] font-black text-[#1D1D2B] px-4">Подтверждение номера</label>
                            <div className="w-full bg-[#D9D9D9] border-none rounded-[20px] h-[60px]"></div>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="px-10 mt-12 space-y-4">
                        <button className="w-full bg-[#4D71F8] text-white font-black py-4 rounded-[20px] text-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all active:scale-[0.98]">
                            Сменить пароль
                        </button>
                        <button
                            onClick={() => onSave(formData)}
                            className="w-full bg-[#11D76A] text-white font-black py-4 rounded-[20px] text-lg shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all active:scale-[0.98]"
                        >
                            Сохранить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;
