import React from 'react';
import { ChevronLeft, ChevronDown, MapPin } from 'lucide-react';
import DentistImg from '../../assets/img/photos/Dentist.png';
interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
    onSave: (data: any) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, initialData, onSave }) => {
    const [formData, setFormData] = React.useState(initialData || {});

    React.useEffect(() => {
        if (isOpen && initialData) {
            setFormData(initialData);
        }
    }, [isOpen, initialData]);

    const handleChange = (field: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-[#F5F8FF] w-full max-w-[1000px] rounded-[32px] p-8 max-h-[90vh] overflow-y-auto relative">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 text-[#1E2532]">
                        <ChevronLeft className="w-5 h-5" strokeWidth={3} />
                    </button>
                    <h2 className="text-[28px] font-bold text-[#1E2532]">Редактирование</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Specialization */}
                        <div>
                            <label className="block text-[#8A94A6] text-sm mb-2">Специализация</label>
                            <div className="relative">
                                <select
                                    value={formData.specialization || 'Хирург'}
                                    onChange={(e) => handleChange('specialization', e.target.value)}
                                    className="w-full h-[56px] bg-white rounded-[16px] px-4 font-bold text-[#1E2532] appearance-none border border-blue-200 focus:outline-none focus:border-blue-400"
                                >
                                    <option>Хирург</option>
                                    <option>Терапевт</option>
                                    <option>Ортодонт</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1E2532] w-5 h-5 pointer-events-none" />
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-[#8A94A6] text-sm mb-2">Телефонный номер</label>
                            <input
                                type="text"
                                value={formData.phone || ''}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                className="w-full h-[56px] bg-white rounded-[16px] px-4 font-bold text-[#1E2532] border border-blue-200 focus:outline-none focus:border-blue-400"
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-[#8A94A6] text-sm mb-2">Адрес</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formData.address || ''}
                                    onChange={(e) => handleChange('address', e.target.value)}
                                    className="w-full h-[56px] bg-white rounded-[16px] px-4 font-bold text-[#1E2532] border border-blue-200 focus:outline-none focus:border-blue-400 pr-12"
                                />
                                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5B6B7F] w-5 h-5" />
                            </div>
                        </div>

                        {/* Clinic */}
                        <div>
                            <input
                                type="text"
                                placeholder="Клиника"
                                value={formData.clinic || ''}
                                onChange={(e) => handleChange('clinic', e.target.value)}
                                className="w-full h-[56px] bg-white rounded-[16px] px-4 font-bold text-[#1E2532] border border-blue-200 focus:outline-none focus:border-blue-400 text-gray-400 placeholder-gray-400"
                            />
                        </div>

                        {/* Schedule */}
                        <div>
                            <label className="block text-[#8A94A6] text-sm mb-2">График работы</label>
                            <div className="relative">
                                <select
                                    value={formData.schedule || 'Каждый день'}
                                    onChange={(e) => handleChange('schedule', e.target.value)}
                                    className="w-full h-[56px] bg-white rounded-[16px] px-4 font-bold text-[#1E2532] appearance-none border border-blue-200 focus:outline-none focus:border-blue-400"
                                >
                                    <option>Каждый день</option>
                                    <option>По будням</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1E2532] w-5 h-5 pointer-events-none" />
                            </div>
                        </div>

                        {/* Working Hours */}
                        <div>
                            <label className="block text-[#8A94A6] text-sm mb-2">Время работы</label>
                            <div className="flex items-center gap-4">
                                <div className="flex bg-white rounded-[16px] border border-blue-200 h-[56px] items-center px-4 gap-1 w-[160px] relative">
                                    <select
                                        value={formData.workStart || '08'}
                                        onChange={(e) => handleChange('workStart', e.target.value)}
                                        className="w-full font-bold text-2xl text-[#1E2532] text-center focus:outline-none appearance-none bg-transparent pr-4"
                                    >
                                        {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map(h => (
                                            <option key={h} value={h}>{h}</option>
                                        ))}
                                    </select>
                                    <span className="text-gray-300">:</span>
                                    <select
                                        value={formData.startMinute || '00'}
                                        onChange={(e) => handleChange('startMinute', e.target.value)}
                                        className="w-full font-bold text-2xl text-[#1E2532] text-center focus:outline-none appearance-none bg-transparent pr-4"
                                    >
                                        {['00', '15', '30', '45'].map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                </div>
                                <div className="flex bg-white rounded-[16px] border border-blue-200 h-[56px] items-center px-4 gap-1 w-[160px] relative">
                                    <select
                                        value={formData.workEnd || '16'}
                                        onChange={(e) => handleChange('workEnd', e.target.value)}
                                        className="w-full font-bold text-2xl text-[#1E2532] text-center focus:outline-none appearance-none bg-transparent pr-4"
                                    >
                                        {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map(h => (
                                            <option key={h} value={h}>{h}</option>
                                        ))}
                                    </select>
                                    <span className="text-gray-300">:</span>
                                    <select
                                        value={formData.endMinute || '00'}
                                        onChange={(e) => handleChange('endMinute', e.target.value)}
                                        className="w-full font-bold text-2xl text-[#1E2532] text-center focus:outline-none appearance-none bg-transparent pr-4"
                                    >
                                        {['00', '15', '30', '45'].map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Profile Photo */}
                        <div className="flex gap-6 mb-8">
                            <div className="w-[120px] h-[120px] rounded-[24px] overflow-hidden bg-gray-100 shrink-0">
                                <img
                                    src={DentistImg}
                                    alt="Doctor"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col gap-3 justify-center">
                                <button className="px-6 py-3 bg-white rounded-[16px] text-[#5B7FFF] font-bold text-sm hover:bg-auth-blue hover:text-white transition-colors border border-blue-100 shadow-sm w-[200px]">
                                    Изменить фото
                                </button>
                                <button className="px-6 py-3 bg-white rounded-[16px] text-[#5B7FFF] font-bold text-sm hover:bg-auth-blue hover:text-white transition-colors border border-blue-100 shadow-sm w-[200px]">
                                    Добавить аватарку
                                </button>
                            </div>
                        </div>

                        {/* Telegram */}
                        <div>
                            <label className="block text-[#8A94A6] text-sm mb-2">Telegram</label>
                            <input
                                type="text"
                                value={formData.telegram || ''}
                                onChange={(e) => handleChange('telegram', e.target.value)}
                                className="w-full h-[56px] bg-white rounded-[16px] px-4 font-bold text-[#1E2532] border border-blue-200 focus:outline-none focus:border-blue-400"
                            />
                        </div>

                        {/* Instagram (1) */}
                        <div>
                            <label className="block text-[#8A94A6] text-sm mb-2">Instagram</label>
                            <input
                                type="text"
                                value={formData.instagram || ''}
                                onChange={(e) => handleChange('instagram', e.target.value)}
                                className="w-full h-[56px] bg-white rounded-[16px] px-4 font-bold text-[#1E2532] border border-blue-200 focus:outline-none focus:border-blue-400"
                            />
                        </div>

                        {/* Instagram (2) - using same value for simplicity for now, as reflected in state */}
                        <div>
                            <label className="block text-[#8A94A6] text-sm mb-2">Instagram</label>
                            <input
                                type="text"
                                value={formData.instagram || ''}
                                onChange={(e) => handleChange('instagram', e.target.value)}
                                className="w-full h-[56px] bg-white rounded-[16px] px-4 font-bold text-[#1E2532] border border-blue-200 focus:outline-none focus:border-blue-400"
                            />
                        </div>

                        {/* WhatsApp */}
                        <div>
                            <label className="block text-[#8A94A6] text-sm mb-2">Whatsapp</label>
                            <input
                                type="text"
                                value={formData.whatsapp || ''}
                                onChange={(e) => handleChange('whatsapp', e.target.value)}
                                className="w-full h-[56px] bg-white rounded-[16px] px-4 font-bold text-[#1E2532] border border-blue-200 focus:outline-none focus:border-blue-400"
                            />
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="mt-8 flex justify-end">
                    <button onClick={() => onSave(formData)} className="bg-[#5B7FFF] text-white px-8 py-3 rounded-[16px] font-bold hover:bg-blue-600 transition-colors">
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;
