import { ArrowLeft, MessageCircle, User, Camera, ClipboardList, Calendar, DollarSign } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { initialPatients } from '../data/patients'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

export default function PatientProfile() {
    const { id } = useParams()
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState('data')

    const patient = initialPatients.find(p => p.id === Number(id))

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

    const tabs = [
        { id: 'data', label: t('patient_profile.tabs.data'), icon: User },
        { id: 'photo', label: t('patient_profile.tabs.photo'), icon: Camera },
        { id: 'treatments', label: t('patient_profile.tabs.treatments'), icon: ClipboardList },
        { id: 'appointments', label: t('patient_profile.tabs.appointments'), icon: Calendar },
        { id: 'payments', label: t('patient_profile.tabs.payments'), icon: DollarSign },
    ]

    return (
        <div className="p-8 bg-[#f5f7fb] min-h-screen font-sans">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link to="/patients" className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-[#1e2235]" />
                </Link>
                <h1 className="text-4xl font-bold text-[#1e2235]">{t('patient_profile.patient_title')}</h1>
            </div>

            {/* Profile Info Card */}
            <div className="bg-white rounded-[40px] p-8 mb-8 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-8">
                    <img
                        src={patient.img}
                        alt={patient.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm"
                    />
                    <div>
                        <h2 className="text-3xl font-bold text-[#1e2235] mb-1">{patient.name}</h2>
                        <span className="text-blue-500 font-medium">{t('patient_profile.online')}</span>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button className="bg-[#5377f7] text-white px-10 py-4 rounded-3xl font-semibold text-lg hover:bg-blue-600 transition-colors">
                        {t('patient_profile.schedule_appointment')}
                    </button>
                    <button className="bg-[#1cdb6f] text-white w-20 h-20 rounded-full flex items-center justify-center hover:bg-[#19c762] transition-colors">
                        <MessageCircle className="w-10 h-10" fill="currentColor" />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-12 mb-8 px-4 border-b border-gray-100">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-3 pb-4 px-2 transition-all relative ${activeTab === tab.id
                                ? 'text-[#5377f7]'
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <tab.icon className={`w-8 h-8 ${activeTab === tab.id ? 'text-[#5377f7]' : 'text-gray-400'}`} />
                        <span className="font-semibold text-lg">{tab.label}</span>
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-[#5377f7] rounded-full"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-[40px] p-12 shadow-sm min-h-[500px]">
                {activeTab === 'data' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Column 1: Personal Info */}
                        <div className="space-y-8">
                            <div className="space-y-1">
                                <p className="text-gray-400 font-medium text-lg uppercase tracking-wider">{t('patient_profile.fio')}</p>
                                <p className="text-[#1e2235] font-bold text-xl">{patient.name}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-gray-400 font-medium text-lg uppercase tracking-wider">{t('patient_profile.birth_date')}</p>
                                <p className="text-[#1e2235] font-bold text-xl">{patient.birthDate || '01.01.1999'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-gray-400 font-medium text-lg uppercase tracking-wider">{t('patient_profile.gender')}</p>
                                <p className="text-[#1e2235] font-bold text-xl">{patient.gender || t('patient_profile.male')}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-gray-400 font-medium text-lg uppercase tracking-wider">{t('patient_profile.phone')}</p>
                                <p className="text-[#1e2235] font-bold text-xl">{patient.phone}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-gray-400 font-medium text-lg uppercase tracking-wider">{t('patient_profile.in_platform')}</p>
                                <p className="text-[#1e2235] font-bold text-xl">С 22.05.2025</p>
                            </div>
                        </div>

                        {/* Column 2: Notes Card */}
                        <div>
                            <div className="bg-[#fbc947] rounded-[30px] p-8 h-full min-h-[400px]">
                                <h3 className="text-white text-2xl font-bold mb-4">{t('patient_profile.notes')}</h3>
                            </div>
                        </div>

                        {/* Column 3: Allergies and Prescription */}
                        <div className="flex flex-col gap-6">
                            <div className="bg-[#ff0000] rounded-[30px] p-8 flex-1 min-h-[200px]">
                                <h3 className="text-white text-2xl font-bold mb-4">{t('patient_profile.allergies')}</h3>
                            </div>
                            <div className="bg-[#e8e8e8] rounded-[30px] p-8 flex-1 min-h-[200px]">
                                <h3 className="text-[#1e2235] text-2xl font-bold mb-4">{t('patient_profile.prescription')}</h3>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
