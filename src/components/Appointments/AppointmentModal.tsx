import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronDown, X, Loader2, Search, Plus, Phone, Check, Clock, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAllPatients, useDentistProfile, useCreatePatient } from '../../api/profile';
import { useCreateAppointment } from '../../api/appointments';
import { useServices } from '../../api/services';
import { toast } from '../Shared/Toast';

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
    const [isServiceOpen, setIsServiceOpen] = useState(false);
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [newPatientPhone, setNewPatientPhone] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const serviceRef = useRef<HTMLDivElement>(null);

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

    // Close dropdowns on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (serviceRef.current && !serviceRef.current.contains(event.target as Node)) {
                setIsServiceOpen(false);
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
            toast.error(errorMessage);
        }
    };

    const handleSave = async () => {
        if (!selectedPatientId || !dentist || !dentist.id) {
            console.error("Cannot save appointment: Missing data", { selectedPatientId, dentistId: dentist?.id });
            return;
        }

        const start = new Date(selectedYear, selectedMonth, selectedDay, parseInt(hour), parseInt(minute));

        // Format explicitly to local ISO without shifting to UTC
        const formatLocalISO = (d: Date) => {
            const pad = (n: number) => n.toString().padStart(2, '0');
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
        };

        try {
            await createAppointment.mutateAsync({
                patient_id: selectedPatientId as number,
                dentist_id: dentist.id,
                start_time: formatLocalISO(start),
                notes: notes,
                service: selectedService
            });
            onSuccess?.();
            onClose();
        } catch (error: any) {
            console.error("Failed to create appointment", error);
            const errorMessage = error.response?.data?.detail || t('common.error_occurred') || "Ошибка при создании записи";
            toast.error(errorMessage);
        }
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-md animate-in fade-in duration-300 cursor-pointer"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-2xl rounded-[40px] p-10 md:p-12 relative shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-white/40 transform animate-in zoom-in-95 duration-300 cursor-default overflow-visible"
            >
                <div
                    onClick={onClose}
                    className="absolute top-6 right-6 cursor-pointer w-12 h-12 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all duration-300 group"
                >
                    <X className="w-6 h-6 text-gray-400 group-hover:text-[#1a1f36] group-hover:rotate-90 transition-all duration-300" />
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-center text-[#1a1f36] mb-10 tracking-tight">
                    {t('modal.title')}
                </h2>

                <div className="space-y-6">
                    {/* Searchable Patient Selection */}
                    <div className="relative" ref={dropdownRef}>
                        <div className="group">
                            <label className="block text-[11px] font-black text-[#1a1f36] mb-2 ml-4 uppercase tracking-widest opacity-40">Пациент</label>
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
                                    className="w-full h-[68px] bg-[#f8f9fc] rounded-[24px] px-8 text-xl font-bold text-[#1a1f36] border-2 border-transparent focus:bg-white focus:border-[#4f6bff] focus:shadow-[0_0_0_8px_rgba(79,107,255,0.05)] transition-all outline-none pr-16"
                                />
                                {isLoadingPatients ? (
                                    <Loader2 className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-[#4f6bff] animate-spin" />
                                ) : (
                                    <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 opacity-40 group-focus-within:text-[#4f6bff] group-focus-within:opacity-100 transition-all" />
                                )}
                            </div>
                        </div>

                        {isDropdownOpen && !showQuickAdd && (
                            <div className="absolute top-[calc(100%+10px)] left-0 right-0 bg-white rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 z-[60] max-h-72 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-300 custom-scrollbar">
                                {filteredPatients.length > 0 ? (
                                    filteredPatients.map((p: any) => (
                                        <div
                                            key={p.id}
                                            onClick={() => {
                                                setSelectedPatientId(p.id);
                                                setSearchTerm('');
                                                setIsDropdownOpen(false);
                                            }}
                                            className="px-8 py-5 hover:bg-[#4f6bff]/5 cursor-pointer transition-colors flex items-center justify-between group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-[#4f6bff]/10 rounded-2xl flex items-center justify-center font-black text-[#4f6bff]">
                                                    {p.full_name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#1a1f36] text-lg group-hover:text-[#4f6bff] transition-colors">{p.full_name}</p>
                                                    <p className="text-xs font-bold text-gray-400 tracking-wide">{p.phone || 'Нет номера'}</p>
                                                </div>
                                            </div>
                                            {selectedPatientId === p.id && <Check className="text-[#4f6bff]" size={20} />}
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
                                                className="w-full mt-2 py-5 bg-[#4f6bff]/5 text-[#4f6bff] rounded-[20px] font-black text-sm flex items-center justify-center gap-2 hover:bg-[#4f6bff]/10 transition-all active:scale-95"
                                            >
                                                <Plus size={18} />
                                                Создать "{searchTerm}"
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Premium Service Selector */}
                        <div className="relative" ref={serviceRef}>
                            <label className="block text-[11px] font-black text-[#1a1f36] mb-2 ml-4 uppercase tracking-widest opacity-40">Услуга</label>
                            <div
                                onClick={() => setIsServiceOpen(!isServiceOpen)}
                                className={`w-full h-[68px] flex items-center justify-between px-8 bg-[#f8f9fc] border-2 rounded-[24px] cursor-pointer transition-all hover:bg-white ${isServiceOpen ? 'border-[#4f6bff] bg-white shadow-[0_0_0_8px_rgba(79,107,255,0.05)]' : 'border-transparent'
                                    }`}
                            >
                                <span className={`text-lg font-bold truncate ${selectedService ? 'text-[#1a1f36]' : 'text-gray-400'}`}>
                                    {selectedService || 'Выберите услугу'}
                                </span>
                                <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isServiceOpen ? 'rotate-180 text-[#4f6bff]' : ''}`} />
                            </div>

                            {isServiceOpen && (
                                <div className="absolute top-[calc(100%+10px)] left-0 right-0 bg-white rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 z-[60] py-3 animate-in fade-in slide-in-from-top-2 duration-300 max-h-60 overflow-y-auto custom-scrollbar">
                                    {services?.map((s: any) => (
                                        <div
                                            key={s.id}
                                            onClick={() => {
                                                setSelectedService(s.name);
                                                setIsServiceOpen(false);
                                            }}
                                            className="px-8 py-4 hover:bg-[#4f6bff]/5 cursor-pointer flex items-center justify-between group"
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-bold text-[#1a1f36] group-hover:text-[#4f6bff] transition-colors">{s.name}</span>
                                                <span className="text-xs font-bold text-gray-400">{s.price} {s.currency || 'UZS'}</span>
                                            </div>
                                            {selectedService === s.name && <Check className="text-[#4f6bff]" size={18} />}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Visit Type Selector */}
                        <div className="group">
                            <label className="block text-[11px] font-black text-[#1a1f36] mb-2 ml-4 uppercase tracking-widest opacity-40">Тип визита</label>
                            <div className="relative">
                                <select
                                    value={visitType}
                                    onChange={(e) => setVisitType(e.target.value as 'primary' | 'repeat')}
                                    className="w-full h-[68px] bg-[#f8f9fc] rounded-[24px] px-8 text-lg font-bold text-[#1a1f36] border-2 border-transparent cursor-pointer hover:bg-white focus:border-[#4f6bff] transition-all outline-none appearance-none"
                                >
                                    <option value="primary">{t('modal.patient_statuses.primary')}</option>
                                    <option value="repeat">{t('modal.patient_statuses.recurring')}</option>
                                </select>
                                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none opacity-40" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                        {/* Date Selection */}
                        <div className="space-y-4">
                            <label className="block text-[11px] font-black text-[#1a1f36] ml-4 uppercase tracking-widest opacity-40 flex items-center gap-2">
                                <Calendar size={14} className="opacity-60" /> {t('modal.date_placeholder')}
                            </label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <select
                                        value={selectedDay}
                                        onChange={(e) => setSelectedDay(parseInt(e.target.value))}
                                        className="w-full h-14 bg-[#f8f9fc] rounded-2xl px-4 text-lg font-black text-[#1a1f36] border-none focus:ring-2 focus:ring-[#4f6bff]/10 outline-none appearance-none cursor-pointer"
                                    >
                                        {days.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                                <div className="relative flex-[2]">
                                    <select
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                        className="w-full h-14 bg-[#f8f9fc] rounded-2xl px-4 text-lg font-black text-[#1a1f36] border-none focus:ring-2 focus:ring-[#4f6bff]/10 outline-none appearance-none cursor-pointer"
                                    >
                                        {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                                <div className="relative flex-1">
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                        className="w-full h-14 bg-[#f8f9fc] rounded-2xl px-4 text-lg font-black text-[#1a1f36] border-none focus:ring-2 focus:ring-[#4f6bff]/10 outline-none appearance-none cursor-pointer"
                                    >
                                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Time Selection */}
                        <div className="space-y-4">
                            <label className="block text-[11px] font-black text-[#1a1f36] ml-4 uppercase tracking-widest opacity-40 flex items-center gap-2">
                                <Clock size={14} className="opacity-60" /> {t('modal.time_label')}
                            </label>
                            <div className="flex items-center gap-3 bg-[#f8f9fc] rounded-[24px] h-[68px] px-8 justify-center border-2 border-transparent focus-within:bg-white focus-within:border-[#4f6bff] transition-all">
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
                                    className="w-14 bg-transparent text-center text-3xl font-black text-[#1a1f36] outline-none border-none p-0 focus:ring-0"
                                />
                                <div className="text-2xl font-black text-gray-300 group-focus-within:text-[#4f6bff]/30 mx-1">:</div>
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
                                    className="w-14 bg-transparent text-center text-3xl font-black text-[#1a1f36] outline-none border-none p-0 focus:ring-0"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t-2 border-gray-50">
                        <label className="block text-[11px] font-black text-[#1a1f36] mb-2 ml-4 uppercase tracking-widest opacity-40">Заметки</label>
                        <textarea
                            placeholder={t('modal.notes_placeholder')}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full h-32 bg-[#f8f9fc] rounded-[28px] p-6 text-lg font-bold text-[#1a1f36] placeholder:text-gray-300 border-2 border-transparent focus:bg-white focus:border-[#4f6bff] transition-all outline-none resize-none"
                        ></textarea>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={!selectedPatientId || createAppointment.isPending}
                        className="w-full h-20 bg-[#00e396] text-white text-xl font-black rounded-[28px] shadow-[0_15px_30px_rgba(0,227,150,0.3)] hover:shadow-[0_20px_40px_rgba(0,227,150,0.4)] hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-4"
                    >
                        {createAppointment.isPending ? (
                            <Loader2 className="animate-spin w-8 h-8" />
                        ) : (
                            <Plus size={28} />
                        )}
                        <span>{t('modal.record')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AppointmentModal;

