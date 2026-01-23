import { ArrowLeft, MessageCircle, FileText, Download } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { initialPatients } from '../data/patients'

export default function PatientProfile() {
    const { id } = useParams()

    const patient = initialPatients.find(p => p.id === Number(id))

    if (!patient) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Пациент не найден</h2>
                    <Link to="/patsent" className="text-blue-600 hover:underline">Вернуться к списку</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">

            <Link to="/patsent" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>Назад</span>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm relative overflow-hidden ring-1 ring-blue-100">
                    <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
                    <h2 className="text-xl font-bold mb-6">Профиль</h2>

                    <div className="flex gap-6 items-start">
                        <img
                            src={patient.img}
                            alt={patient.name}
                            className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
                        />

                        <div className="space-y-2 flex-1">
                            <h3 className="text-2xl font-bold text-gray-900">{patient.name}</h3>

                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                                <div className="text-gray-500">Возраст</div>
                                <div className="font-semibold">{patient.age}</div>

                                <div className="text-gray-500">Пол</div>
                                <div className="font-semibold">{patient.gender || 'Не указан'}</div>

                                <div className="text-gray-500">Статус</div>
                                <div className={`font-semibold ${patient.statusColor}`}>{patient.status}</div>
                            </div>
                        </div>
                    </div>

                    <button className="absolute bottom-6 right-6 flex items-center gap-2 bg-[#1e2532] text-white px-4 py-2 rounded-lg hover:bg-[#2c3545] transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span>Чат</span>
                    </button>
                </div>

                {/* Appointments Prompt */}
                <div className="bg-gray-800 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center text-white relative overflow-hidden">
                    <div className="absolute top-4 left-4 bg-white/10 px-3 py-1 rounded-full text-xs">Прием: 24 Декабря</div>

                    <div className="z-10 max-w-xs">
                        <h3 className="text-lg font-medium mb-4">Пока что у вас нет приёмов в данный момент</h3>
                        <button className="bg-[#1e2532] border border-gray-600 px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                            Назначить приём
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Data Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold mb-6">Данные</h2>

                    <div className="grid grid-cols-2 gap-y-6">
                        <div>
                            <div className="text-gray-500 text-sm mb-1">Диагноз</div>
                            <div className="font-semibold">{patient.diagnosis}</div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-sm mb-1">Дата рождения</div>
                            <div className="font-semibold">{patient.birthDate || 'Не указана'}</div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-sm mb-1">Врач</div>
                            <div className="font-semibold">{patient.doctor || 'Не назначен'}</div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-sm mb-1">Номер</div>
                            <div className="font-semibold">{patient.phone}</div>
                        </div>
                    </div>
                </div>

                {/* Diseases Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold mb-6">Заболевания</h2>

                    <div className="space-y-4">
                        <div className="border border-gray-200 rounded-xl p-4 flex justify-between items-center">
                            <div>
                                <div className="text-gray-500 text-xs mb-1">Аллергии</div>
                                <div className="font-medium">Арахис, Пенициллин</div>
                            </div>
                            <div className="text-center">
                                <div className="text-gray-500 text-xs mb-1">Тяжесть</div>
                                <div className="text-green-600 font-medium text-sm">Лёгкая</div>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-xl p-4 flex justify-between items-center">
                            <div>
                                <div className="text-gray-500 text-xs mb-1">Болезни</div>
                                <div className="font-medium">Сахарный диабет</div>
                            </div>
                            <div className="text-center">
                                <div className="text-gray-500 text-xs mb-1">Тяжесть</div>
                                <div className="text-red-500 font-medium text-sm">Тяжёлое</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Appointments Table */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-6">Приёмы</h2>

                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-200 text-gray-500 text-sm">
                                <th className="pb-3 font-medium">Врач</th>
                                <th className="pb-3 font-medium">Дата</th>
                                <th className="pb-3 font-medium">Диагноз</th>
                                <th className="pb-3 font-medium text-right">Отчет</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="text-sm">
                                <td className="py-4 font-medium">{patient.doctor || 'Не назначен'}</td>
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
