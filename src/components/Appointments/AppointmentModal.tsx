import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronDown, X, Loader2, Search, Plus, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAllPatients, useDentistProfile, useCreatePatient } from '../../api/profile';
import { useCreateAppointment } from '../../api/appointments';
import { useServices } from '../../api/services';

interface AppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialPatientId?: number;
    onSuccess?: () => void;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose, initialPatientId, onSuccess }) => {
    const { t } = useTranslation();
    const [selectedPatientId, setSelectedPatientId] = useState<number | ''>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [newPatientPhone, setNewPatientPhone] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [selectedDay, setSelectedDay] = useState(new Date().getDate());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [hour, setHour] = useState('08');
    const [minute, setMinute] = useState('00');
    const [notes, setNotes] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [visitType, setVisitType] = useState<'primary' | 'repeat'>('primary');

    useEffect(() => {
        if (isOpen && initialPatientId) {
            setSelectedPatientId(initialPatientId);
        }
    }, [isOpen, initialPatientId]);

    const { data: patients, isLoading: isLoadingPatients } = useAllPatients();
    const { data: dentist } = useDentistProfile();
    const { data: services } = useServices();
    const createAppointment = useCreateAppointment();
    const createPatient = useCreatePatient();

    // Set default service when services load
    useEffect(() => {
        if (services && services.length > 0 && !selectedService) {
            setSelectedService(services[0].name);
        }
    }, [services]);

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

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => ({
        value: i,
        label: t(`common.months.${i}`)
    }));
    const years = Array.from({ length: 11 }, (_, i) => 2024 + i);

    const handleQuickAdd = async () => {
        if (!searchTerm || !newPatientPhone) return;
        try {
            const patient = await createPatient.mutateAsync({
                full_name: searchTerm,
                phone: newPatientPhone
            });
            setSelectedPatientId(patient.id);
            setSearchTerm('');
            setShowQuickAdd(false);
            setIsDropdownOpen(false);
        } catch (error: any) {
            console.error("Failed to create patient", error);
            const errorMessage = error.response?.data?.detail || "Failed to create patient";
            alert(errorMessage);
        }
    };

    const handleSave = async () => {
        if (!selectedPatientId || !dentist || !dentist.id) {
            console.error("Cannot save appointment: Missing data", { selectedPatientId, dentistId: dentist?.id });
            return;
        }

        const start = new Date(selectedYear, selectedMonth, selectedDay, parseInt(hour), parseInt(minute));
        const end = new Date(start.getTime() + 60 * 60 * 1000); // Default 1 hour duration

        try {
            await createAppointment.mutateAsync({
                patient_id: selectedPatientId as number,
                dentist_id: dentist.id,
                start_time: start.toISOString(),
                end_time: end.toISOString(),
                notes: notes,
                service: selectedService
            });
            onSuccess?.();
            onClose();
        } catch (error: any) {
            console.error("Failed to create appointment", error);
            const errorMessage = error.response?.data?.detail || t('common.error_occurred') || "Ошибка при создании записи";
            alert(errorMessage);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-2xl rounded-[32px] p-6 md:p-8 relative shadow-2xl animate-in zoom-in-95 duration-200 cursor-default overflow-visible"
            >
                <div
                    onClick={onClose}
                    className="absolute top-4 right-4 md:top-6 md:right-6 cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors group"
                >
                    <X className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-[#1a1f36] transition-colors" />
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-center text-[#1a1f36] mb-6 md:mb-8 tracking-tight">
                    {t('modal.title')}
                </h2>

                <div className="space-y-4 md:space-y-5">
                    {/* Row 1: Searchable Patient Selection */}
                    <div className="grid grid-cols-1 gap-4 md:gap-5 relative" ref={dropdownRef}>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={t('modal.name_placeholder') || 'Выберите пациента'}
                                value={isDropdownOpen ? searchTerm : selectedPatientName || searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setIsDropdownOpen(true);
                                    if (!e.target.value) {
                                        setSelectedPatientId('');
                                        setShowQuickAdd(false);
                                    }
                                }}
                                onFocus={() => setIsDropdownOpen(true)}
                                className="w-full h-12 md:h-14 bg-[#efefef] rounded-[16px] px-5 text-base md:text-lg font-bold text-[#1a1f36] border-none focus:ring-2 focus:ring-[#4f6bff]/20 outline-none"
                            />
                            {isLoadingPatients ? (
                                <Loader2 className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-[#1a1f36] animate-spin opacity-40" />
                            ) : (
                                <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-[#1a1f36] pointer-events-none opacity-40" />
                            )}
                        </div>

                        {isDropdownOpen && !showQuickAdd && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[24px] shadow-2xl border border-gray-100 z-[60] max-h-60 overflow-y-auto overflow-x-hidden animate-in slide-in-from-top-2 duration-200">
                                {filteredPatients.length > 0 ? (
                                    filteredPatients.map((p: any) => (
                                        <div
                                            key={p.id}
                                            onClick={() => {
                                                setSelectedPatientId(p.id);
                                                setSearchTerm('');
                                                setIsDropdownOpen(false);
                                            }}
                                            className="px-6 py-4 hover:bg-[#4f6bff]/10 cursor-pointer transition-colors flex items-center gap-3"
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
                                    <div className="p-4">
                                        <div className="px-6 py-4 text-center text-gray-400 font-bold">
                                            {t('common.no_results') || 'Пациент не найден'}
                                        </div>
                                        {searchTerm.length > 2 && (
                                            <button
                                                onClick={() => setShowQuickAdd(true)}
                                                className="w-full mt-2 py-4 bg-[#4f6bff]/10 text-[#4f6bff] rounded-[18px] font-bold flex items-center justify-center gap-2 hover:bg-[#4f6bff]/20 transition-colors"
                                            >
                                                <Plus size={20} />
                                                Добавить "{searchTerm}" как нового пациента
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {showQuickAdd && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[24px] shadow-2xl border border-gray-100 z-[60] p-6 animate-in slide-in-from-top-2 duration-200">
                                <h3 className="font-bold text-[#1a1f36] mb-4 flex items-center gap-2">
                                    <Plus size={18} /> Быстрое добавление пациента
                                </h3>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            placeholder="Номер телефона"
                                            value={newPatientPhone}
                                            onChange={(e) => setNewPatientPhone(e.target.value)}
                                            className="w-full h-14 bg-[#efefef] rounded-[15px] px-10 text-lg font-bold text-[#1a1f36] border-none focus:ring-2 focus:ring-[#4f6bff]/20 outline-none"
                                        />
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowQuickAdd(false)}
                                            className="flex-1 py-3 bg-gray-100 text-gray-500 font-bold rounded-[15px] hover:bg-gray-200 transition-colors"
                                        >
                                            Отмена
                                        </button>
                                        <button
                                            onClick={handleQuickAdd}
                                            disabled={!newPatientPhone || createPatient.isPending}
                                            className="flex-[2] py-3 bg-[#4f6bff] text-white font-bold rounded-[15px] hover:bg-[#3d56d5] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {createPatient.isPending && <Loader2 size={18} className="animate-spin" />}
                                            Создать и выбрать
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                        <div className="relative">
                            <select
                                value={selectedService}
                                onChange={(e) => setSelectedService(e.target.value)}
                                className="w-full h-12 md:h-14 bg-[#efefef] rounded-[16px] px-5 text-base md:text-lg font-bold text-[#1a1f36] border-none appearance-none cursor-pointer focus:ring-2 focus:ring-[#4f6bff]/20 outline-none"
                            >
                                {services?.map((s: any) => (
                                    <option key={s.id} value={s.name}>
                                        {s.name} - {s.price} {s.currency || 'UZS'}
                                    </option>
                                ))}
                                {!services || services.length === 0 && (
                                    <option value="" disabled>Нет доступных услуг</option>
                                )}
                            </select>
                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a1f36] pointer-events-none opacity-40" />
                        </div>
                        <div className="relative">
                            <select
                                value={visitType}
                                onChange={(e) => setVisitType(e.target.value as 'primary' | 'repeat')}
                                className="w-full h-12 md:h-14 bg-[#efefef] rounded-[16px] px-5 text-base md:text-lg font-bold text-[#1a1f36] border-none appearance-none cursor-pointer focus:ring-2 focus:ring-[#4f6bff]/20 outline-none"
                            >
                                <option value="primary">{t('modal.patient_statuses.primary')}</option>
                                <option value="repeat">{t('modal.patient_statuses.recurring')}</option>
                            </select>
                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a1f36] pointer-events-none opacity-40" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-[1.5fr,1fr] gap-4 md:gap-5 items-end">
                        <div className="flex flex-col gap-2">
                            <label className="text-left text-sm font-bold text-gray-500 ml-2">{t('modal.date_placeholder')}</label>
                            <div className="flex gap-2 h-12 md:h-14">
                                <div className="relative flex-1">
                                    <select
                                        value={selectedDay}
                                        onChange={(e) => setSelectedDay(parseInt(e.target.value))}
                                        className="w-full h-full bg-[#efefef] rounded-[16px] px-3 pr-8 text-base md:text-lg font-bold text-[#1a1f36] border-none focus:ring-2 focus:ring-[#4f6bff]/20 outline-none appearance-none cursor-pointer"
                                    >
                                        {days.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f6377] pointer-events-none" />
                                </div>

                                <div className="relative flex-[2]">
                                    <select
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                        className="w-full h-full bg-[#efefef] rounded-[16px] px-3 pr-8 text-base md:text-lg font-bold text-[#1a1f36] border-none focus:ring-2 focus:ring-[#4f6bff]/20 outline-none appearance-none cursor-pointer"
                                    >
                                        {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f6377] pointer-events-none" />
                                </div>

                                <div className="relative flex-1">
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                        className="w-full h-full bg-[#efefef] rounded-[16px] px-3 pr-8 text-base md:text-lg font-bold text-[#1a1f36] border-none focus:ring-2 focus:ring-[#4f6bff]/20 outline-none appearance-none cursor-pointer"
                                    >
                                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f6377] pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-right text-sm font-bold text-gray-500 mr-2">{t('modal.time_label')}</label>
                            <div className="flex items-center gap-2 bg-[#efefef] rounded-[16px] p-2 h-12 md:h-14 px-4 justify-center">
                                <input
                                    type="text"
                                    value={hour}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                                        const num = parseInt(val) || 0;
                                        setHour(num > 23 ? '23' : val);
                                    }}
                                    onBlur={(e) => {
                                        const val = e.target.value;
                                        if (val.length === 1) setHour('0' + val);
                                        if (val === '') setHour('00');
                                    }}
                                    className="w-12 md:w-16 bg-transparent text-center text-2xl md:text-3xl font-black text-[#1a1f36] outline-none border-none p-0 focus:ring-0"
                                />
                                <div className="h-6 md:h-8 w-[2px] bg-gray-300 mx-1 md:mx-2"></div>
                                <input
                                    type="text"
                                    value={minute}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                                        const num = parseInt(val) || 0;
                                        setMinute(num > 59 ? '59' : val);
                                    }}
                                    onBlur={(e) => {
                                        const val = e.target.value;
                                        if (val.length === 1) setMinute('0' + val);
                                        if (val === '') setMinute('00');
                                    }}
                                    className="w-12 md:w-16 bg-transparent text-center text-2xl md:text-3xl font-black text-[#1a1f36] outline-none border-none p-0 focus:ring-0"
                                />
                            </div>
                        </div>
                    </div>

                    <textarea
                        placeholder={t('modal.notes_placeholder')}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full h-24 md:h-32 bg-[#efefef] rounded-[16px] p-4 md:p-5 text-base md:text-lg font-bold text-[#1a1f36] placeholder:text-gray-500 border-none focus:ring-2 focus:ring-[#4f6bff]/20 outline-none resize-none"
                    ></textarea>

                    <button
                        onClick={handleSave}
                        disabled={!selectedPatientId || createAppointment.isPending}
                        className="w-full py-4 md:py-5 bg-[#00e396] text-white text-lg md:text-xl font-black rounded-[20px] shadow-lg shadow-[#00e396]/20 hover:bg-[#00d08a] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {createAppointment.isPending && <Loader2 className="animate-spin" />}
                        {t('modal.record')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AppointmentModal;
