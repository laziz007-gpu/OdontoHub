import { useState, useMemo } from 'react'
import { ArrowLeft, MessageCircle, User, Camera, ClipboardList, Calendar, DollarSign, Loader2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { paths } from '../Routes/path'
import PhotoGrid from '../components/PatientProfile/PhotoGrid'
import TreatmentsTable from '../components/PatientProfile/TreatmentsTable'
import PaymentsView from '../components/PatientProfile/PaymentsView'
import AppointmentsView from '../components/PatientProfile/AppointmentsView'
import AppointmentModal from '../components/Appointments/AppointmentModal'
import { usePatient } from '../api/profile'
import Rasm from "../assets/img/photos/Subtract.png"

type TabId = 'data' | 'photo' | 'treatments' | 'appointments' | 'payments'

interface Tab {
    id: TabId
    label: string
    icon: LucideIcon
}

export default function PatientProfile() {
    const { id } = useParams<{ id: string }>()
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState<TabId>('data')
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)

    const { data: apiPatient, isLoading } = usePatient(Number(id))

    const patient = useMemo(() => {
        if (!apiPatient) return null;
        return {
            id: apiPatient.id,
            name: apiPatient.full_name || 'No Name',
            phone: apiPatient.phone || '',
            birthDate: apiPatient.birth_date ? new Date(apiPatient.birth_date).toLocaleDateString() : '01.01.1999',
            gender: apiPatient.gender === 'male' ? t('patient_profile.male') : apiPatient.gender === 'female' ? t('patient_profile.female') : t('patient_profile.not_specified'),
            img: Rasm, // Default image for now
            status: 'НОВЫЙ',
            diagnosis: apiPatient.source || 'Checkup'
        } as any;
    }, [apiPatient, t]);

    if (isLoading) {
        return (
            <div className="p-6 bg-[#f5f7fb] min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-[#5377f7]" />
            </div>
        )
    }

    if (!patient) {
        return (
            <div className="p-6 bg-[#f5f7fb] min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">{t('patient_profile.not_found')}</h2>
                    <Link to="/patients" className="text-blue-600 hover:underline">{t('patient_profile.back_to_list')}</Link>
                </div>
            </div>
        )
    }

    const tabs: Tab[] = [
        { id: 'data', label: t('patient_profile.tabs.data'), icon: User },
        { id: 'photo', label: t('patient_profile.tabs.photo'), icon: Camera },
        { id: 'treatments', label: t('patient_profile.tabs.treatments'), icon: ClipboardList },
        { id: 'appointments', label: t('patient_profile.tabs.appointments'), icon: Calendar },
        { id: 'payments', label: t('patient_profile.tabs.payments'), icon: DollarSign },
    ]

    return (
        <div className="p-4 md:p-8 bg-[#f5f7fb] min-h-screen font-sans">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 md:mb-8">
                <Link to="/patients" className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors shrink-0">
                    <ArrowLeft className="w-5 h-5 text-[#1e2235]" />
                </Link>
                <h1 className="text-2xl md:text-4xl font-bold text-[#1e2235] truncate">{t('patient_profile.patient_title')}</h1>
            </div>

            {/* Profile Info Card */}
            <div className="bg-white rounded-[24px] md:rounded-[40px] p-6 md:p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm gap-6">
                <div className="flex items-center gap-4 md:gap-8">
                    <img
                        src={patient.img}
                        alt={patient.name}
                        className="w-16 h-16 md:w-24 md:h-24 rounded-full object-cover border-4 border-white shadow-sm shrink-0"
                    />
                    <div>
                        <h2 className="text-xl md:text-3xl font-bold text-[#1e2235] mb-1 leading-tight">{patient.name}</h2>
                        <span className="text-blue-500 font-medium">{t('patient_profile.online')}</span>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <button
                        onClick={() => setIsAppointmentModalOpen(true)}
                        className="bg-[#5377f7] text-white px-6 md:px-10 py-3 md:py-4 rounded-2xl md:rounded-3xl font-semibold text-base md:text-lg hover:bg-blue-600 transition-colors w-full md:w-auto"
                    >
                        {t('patient_profile.schedule_appointment')}
                    </button>
                    <Link to={paths.chatDetail.replace(':id', String(patient.id))} className="w-full md:w-auto flex justify-center">
                        <button className="bg-[#1cdb6f] text-white w-full sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 rounded-2xl sm:rounded-full flex items-center justify-center hover:bg-[#19c762] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-green-500/20">
                            <MessageCircle className="w-6 h-6 md:w-10 md:h-10" fill="currentColor" />
                            <span className="sm:hidden ml-2 font-bold">{t('patient_profile.tabs.chat')}</span>
                        </button>
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-8 md:gap-12 mb-8 px-4 border-b border-gray-100 overflow-x-auto no-scrollbar scroll-smooth">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 md:gap-3 pb-4 px-1 transition-all relative whitespace-nowrap ${activeTab === tab.id
                            ? 'text-[#5377f7]'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <tab.icon className={`w-6 h-6 md:w-8 md:h-8 ${activeTab === tab.id ? 'text-[#5377f7]' : 'text-gray-400'}`} />
                        <span className="font-semibold text-base md:text-lg">{tab.label}</span>
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-[#5377f7] rounded-full"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-[24px] md:rounded-[40px] p-6 md:p-12 shadow-sm min-h-[400px]">
                {activeTab === 'data' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                        {/* Column 1: Personal Info */}
                        <div className="space-y-6 md:space-y-8">
                            <div className="space-y-1">
                                <p className="text-gray-400 font-medium text-base md:text-lg uppercase tracking-wider">{t('patient_profile.fio')}</p>
                                <p className="text-[#1e2235] font-bold text-lg md:text-xl">{patient.name}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-gray-400 font-medium text-base md:text-lg uppercase tracking-wider">{t('patient_profile.birth_date')}</p>
                                <p className="text-[#1e2235] font-bold text-lg md:text-xl">{patient.birthDate || '01.01.1999'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-gray-400 font-medium text-base md:text-lg uppercase tracking-wider">{t('patient_profile.gender')}</p>
                                <p className="text-[#1e2235] font-bold text-lg md:text-xl">{patient.gender || t('patient_profile.male')}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-gray-400 font-medium text-base md:text-lg uppercase tracking-wider">{t('patient_profile.phone')}</p>
                                <p className="text-[#1e2235] font-bold text-lg md:text-xl">{patient.phone}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-gray-400 font-medium text-base md:text-lg uppercase tracking-wider">{t('patient_profile.in_platform')}</p>
                                <p className="text-[#1e2235] font-bold text-lg md:text-xl">С 22.05.2025</p>
                            </div>
                        </div>

                        {/* Column 2: Notes Card */}
                        <div className="min-h-[250px] md:min-h-[400px]">
                            <div className="bg-[#fbc947] rounded-[24px] md:rounded-[30px] p-6 md:p-8 h-full">
                                <h3 className="text-white text-xl md:text-2xl font-bold mb-4">{t('patient_profile.notes')}</h3>
                            </div>
                        </div>

                        {/* Column 3: Allergies and Prescription */}
                        <div className="flex flex-col gap-6">
                            <div className="bg-[#ff0000] rounded-[24px] md:rounded-[30px] p-6 md:p-8 flex-1 min-h-[150px] md:min-h-[200px]">
                                <h3 className="text-white text-xl md:text-2xl font-bold mb-4">{t('patient_profile.allergies')}</h3>
                            </div>
                            <div className="bg-[#e8e8e8] rounded-[24px] md:rounded-[30px] p-6 md:p-8 flex-1 min-h-[150px] md:min-h-[200px]">
                                <h3 className="text-[#1e2235] text-xl md:text-2xl font-bold mb-4">{t('patient_profile.prescription')}</h3>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'photo' && <PhotoGrid patientId={id!} />}

                {activeTab === 'treatments' && <TreatmentsTable />}

                {activeTab === 'appointments' && <AppointmentsView patientId={Number(id)} />}

                {activeTab === 'payments' && <PaymentsView />}
            </div>

            <AppointmentModal
                isOpen={isAppointmentModalOpen}
                onClose={() => setIsAppointmentModalOpen(false)}
                initialPatientId={Number(id)}
            />
        </div>
    )
}
