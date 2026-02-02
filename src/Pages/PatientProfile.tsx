import { ArrowLeft, MessageCircle, Download } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { initialPatients } from '../data/patients'
import { useTranslation } from 'react-i18next'

export default function PatientProfile() {
    const { id } = useParams()
    const { t } = useTranslation()

    const patient = initialPatients.find(p => p.id === Number(id))

    const getStatusLabel = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'ЛЕЧИТСЯ':
                return t('patients_list.statuses.treating');
            case 'НОВЫЙ':
                return t('patients_list.statuses.new');
            case 'ЗАПИСАН':
                return t('patients_list.statuses.recorded');
            default:
                return status;
        }
    };

    const getGenderLabel = (gender: string) => {
        switch (gender?.toUpperCase()) {
            case 'МУЖЧИНА':
                return t('patient_profile.male');
            case 'ЖЕНЩИНА':
                return t('patient_profile.female');
            default:
                return gender || t('patient_profile.not_specified');
        }
    };

    if (!patient) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">{t('patient_profile.not_found')}</h2>
                    <Link to="/patients" className="text-blue-600 hover:underline">{t('patient_profile.back_to_list')}</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">

            <Link to="/patients" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>{t('patient_profile.back')}</span>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm relative overflow-hidden ring-1 ring-blue-100">
                    <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
                    <h2 className="text-xl font-bold mb-6">{t('patient_profile.profile')}</h2>

                    <div className="flex gap-6 items-start">
                        <img
                            src={patient.img}
                            alt={patient.name}
                            className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
                        />

                        <div className="space-y-2 flex-1">
                            <h3 className="text-2xl font-bold text-gray-900">{patient.name}</h3>

                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                                <div className="text-gray-500">{t('patient_profile.age')}</div>
                                <div className="font-semibold">{patient.age}</div>

                                <div className="text-gray-500">{t('patient_profile.gender')}</div>
                                <div className="font-semibold">{getGenderLabel(patient.gender || '')}</div>

                                <div className="text-gray-500">{t('patient_profile.status')}</div>
                                <div className={`font-semibold ${patient.statusColor}`}>{getStatusLabel(patient.status)}</div>
                            </div>
                        </div>
                    </div>

                    <button className="absolute bottom-6 right-6 flex items-center gap-2 bg-[#1e2532] text-white px-4 py-2 rounded-lg hover:bg-[#2c3545] transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span>{t('patient_profile.chat')}</span>
                    </button>
                </div>

                {/* Appointments Prompt */}
                <div className="bg-gray-800 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center text-white relative overflow-hidden">
                    <div className="absolute top-4 left-4 bg-white/10 px-3 py-1 rounded-full text-xs">{t('patient_profile.next_appointment')}</div>

                    <div className="z-10 max-w-xs">
                        <h3 className="text-lg font-medium mb-4">{t('patient_profile.no_appointments')}</h3>
                        <button className="bg-[#1e2532] border border-gray-600 px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                            {t('patient_profile.schedule_appointment')}
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Data Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold mb-6">{t('patient_profile.data')}</h2>

                    <div className="grid grid-cols-2 gap-y-6">
                        <div>
                            <div className="text-gray-500 text-sm mb-1">{t('patient_profile.diagnosis')}</div>
                            <div className="font-semibold">{patient.diagnosis}</div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-sm mb-1">{t('patient_profile.birth_date')}</div>
                            <div className="font-semibold">{patient.birthDate || t('patient_profile.not_specified')}</div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-sm mb-1">{t('patient_profile.doctor')}</div>
                            <div className="font-semibold">{patient.doctor || t('patient_profile.not_assigned')}</div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-sm mb-1">{t('patient_profile.phone')}</div>
                            <div className="font-semibold">{patient.phone}</div>
                        </div>
                    </div>
                </div>

                {/* Diseases Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold mb-6">{t('patient_profile.diseases')}</h2>

                    <div className="space-y-4">
                        <div className="border border-gray-200 rounded-xl p-4 flex justify-between items-center">
                            <div>
                                <div className="text-gray-500 text-xs mb-1">{t('patient_profile.allergies')}</div>
                                <div className="font-medium">{t('patient_profile.allergies_list')}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-gray-500 text-xs mb-1">{t('patient_profile.severity')}</div>
                                <div className="text-green-600 font-medium text-sm">{t('patient_profile.mild')}</div>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-xl p-4 flex justify-between items-center">
                            <div>
                                <div className="text-gray-500 text-xs mb-1">{t('patient_profile.illnesses')}</div>
                                <div className="font-medium">{t('patient_profile.illnesses_list')}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-gray-500 text-xs mb-1">{t('patient_profile.severity')}</div>
                                <div className="text-red-500 font-medium text-sm">{t('patient_profile.severe')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Appointments Table */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-6">{t('appointments.title')}</h2>

                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-200 text-gray-500 text-sm">
                                <th className="pb-3 font-medium">{t('patient_profile.doctor')}</th>
                                <th className="pb-3 font-medium">{t('patient_profile.date')}</th>
                                <th className="pb-3 font-medium">{t('patient_profile.diagnosis')}</th>
                                <th className="pb-3 font-medium text-right">{t('patient_profile.report')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="text-sm">
                                <td className="py-4 font-medium">{patient.doctor || t('patient_profile.not_assigned')}</td>
                                <td className="py-4">19.12.2025</td>
                                <td className="py-4">{patient.diagnosis}</td>
                                <td className="py-4 text-right">
                                    <button className="inline-flex items-center gap-1 text-gray-800 hover:text-blue-600 font-medium underline">
                                        PDF <Download className="w-3 h-3" />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}
