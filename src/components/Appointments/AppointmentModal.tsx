import React from 'react';
import { Calendar, ChevronDown, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-4xl rounded-[40px] p-8 md:p-12 relative shadow-2xl animate-in zoom-in-95 duration-200 cursor-default"
            >
                {/* Close Button (Optional/Hidden in design but good for UX) -> Design doesn't show one explicitly, but usually needed. 
                    I'll add a subtle one or handle click outside. For now, strictly following design - no visible close X in image, 
                    but maybe clicking outside closes it. I will leave it out for strict visual match or put it top right hidden.
                */}
                <div
                    onClick={onClose}
                    className="absolute top-6 right-6 md:top-8 md:right-8 cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors group"
                >
                    <X className="w-6 h-6 md:w-8 md:h-8 text-gray-400 group-hover:text-[#1a1f36] transition-colors" />
                </div>

                <h2 className="text-3xl md:text-[42px] font-black text-center text-[#1a1f36] mb-10 tracking-tight">
                    {t('modal.title')}
                </h2>

                <div className="space-y-4 md:space-y-6">
                    {/* Row 1: Name and Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <input
                            type="text"
                            placeholder={t('modal.name_placeholder')}
                            className="w-full h-14 md:h-16 bg-[#efefef] rounded-[18px] px-6 text-lg font-bold text-[#1a1f36] placeholder:text-gray-500 border-none focus:ring-2 focus:ring-[#4f6bff]/20 outline-none"
                        />
                        <div className="relative">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center h-full">
                                <span className="text-lg font-bold text-[#1a1f36] pr-3 border-r border-gray-300 mr-3">
                                    +998
                                </span>
                            </div>
                            <input
                                type="text"
                                placeholder={t('modal.phone_placeholder')}
                                className="w-full h-14 md:h-16 bg-[#efefef] rounded-[18px] pl-28 pr-6 text-lg font-bold text-[#1a1f36] placeholder:text-gray-500 border-none focus:ring-2 focus:ring-[#4f6bff]/20 outline-none"
                            />
                        </div>
                    </div>

                    {/* Row 2: Service and Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="relative">
                            <select className="w-full h-14 md:h-16 bg-[#efefef] rounded-[18px] px-6 text-lg font-bold text-gray-500 border-none focus:ring-2 focus:ring-[#4f6bff]/20 outline-none appearance-none cursor-pointer">
                                <option>{t('modal.service_placeholder')}</option>
                                <option>{t('modal.services.implantation')}</option>
                                <option>{t('modal.services.consultation')}</option>
                            </select>
                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-[#1a1f36] pointer-events-none" />
                        </div>
                        <div className="relative">
                            <select className="w-full h-14 md:h-16 bg-[#efefef] rounded-[18px] px-6 text-lg font-bold text-gray-500 border-none focus:ring-2 focus:ring-[#4f6bff]/20 outline-none appearance-none cursor-pointer">
                                <option>{t('modal.status_placeholder')}</option>
                                <option>{t('modal.patient_statuses.primary')}</option>
                                <option>{t('modal.patient_statuses.recurring')}</option>
                            </select>
                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-[#1a1f36] pointer-events-none" />
                        </div>
                    </div>

                    {/* Row 3: Date and Time */}
                    <div className="grid grid-cols-1 md:grid-cols-[1.5fr,1fr] gap-4 md:gap-6 items-end">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={t('modal.date_placeholder')}
                                className="w-full h-14 md:h-16 bg-[#efefef] rounded-[18px] px-6 text-lg font-bold text-[#1a1f36] placeholder:text-gray-500 border-none focus:ring-2 focus:ring-[#4f6bff]/20 outline-none cursor-pointer"
                            />
                            <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-[#5f6377] pointer-events-none" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-right text-sm md:text-base font-bold text-gray-500 mr-2">{t('modal.time_label')}</label>
                            <div className="flex items-center gap-2 bg-[#efefef] rounded-[18px] p-2 h-14 md:h-16 px-4 justify-center">
                                <input
                                    type="text"
                                    defaultValue="08"
                                    className="w-16 bg-transparent text-center text-3xl font-black text-[#1a1f36] outline-none border-none p-0 focus:ring-0"
                                />
                                <div className="h-8 w-[2px] bg-gray-300 mx-2"></div>
                                <input
                                    type="text"
                                    defaultValue="00"
                                    className="w-16 bg-transparent text-center text-3xl font-black text-[#1a1f36] outline-none border-none p-0 focus:ring-0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Row 4: Notes */}
                    <textarea
                        placeholder={t('modal.notes_placeholder')}
                        className="w-full h-32 md:h-40 bg-[#efefef] rounded-[18px] p-6 text-lg font-bold text-[#1a1f36] placeholder:text-gray-500 border-none focus:ring-2 focus:ring-[#4f6bff]/20 outline-none resize-none"
                    ></textarea>
                </div>
            </div>
        </div>
    );
};

export default AppointmentModal;
