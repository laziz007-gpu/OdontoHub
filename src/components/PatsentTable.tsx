import { Search, Plus, Filter } from 'lucide-react'
import { useState } from 'react'

interface Patient {
  id: number
  name: string
  age: number
  phone: string
  diagnosis: string
  status: string
  statusColor: string
  avatar: string
}

export default function PatientsTable(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState<string>('')

  const patients: Patient[] = [
    {
      id: 1,
      name: 'Дункан Факовский',
      age: 27,
      phone: '+998 88 022 00 54',
      diagnosis: 'Сломанный зуб',
      status: 'ЛЕЧИТСЯ',
      statusColor: 'text-blue-600',
      avatar: '👨',
    },
    {
      id: 2,
      name: 'Алишер Махкамбетов',
      age: 21,
      phone: '+998 56 789 10 11',
      diagnosis: 'Кариес',
      status: 'НОВЫЙ',
      statusColor: 'text-green-600',
      avatar: '👨',
    },
    {
      id: 3,
      name: 'Касымов Бекмамбетов',
      age: 32,
      phone: '+998 90 123 45 67',
      diagnosis: 'Больной зуб',
      status: 'ЗАПИСАН',
      statusColor: 'text-gray-800',
      avatar: '👨‍💼',
    },
    {
      id: 4,
      name: 'Эргашев Мамурбек',
      age: 36,
      phone: '+998 90 123 45 67',
      diagnosis: 'Эрозия',
      status: 'НОВЫЙ',
      statusColor: 'text-green-600',
      avatar: '👨‍🦱',
    },
    {
      id: 5,
      name: 'Мамуров Джахонгир',
      age: 42,
      phone: '+998 90 123 45 67',
      diagnosis: 'Пульпит',
      status: 'ЛЕЧИТСЯ',
      statusColor: 'text-blue-600',
      avatar: '👨‍🔬',
    },
  ]

  const filteredPatients: Patient[] = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone.includes(searchQuery) ||
    patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-5 gap-4 px-6 py-3 bg-white border-b border-gray-200 font-medium text-gray-600 text-sm">
        <div>Имя</div>
        <div>Возраст</div>
        <div>Номер</div>
        <div>Диагноз</div>
        <div>Статус</div>
      </div>

      <div className="space-y-2 mt-2">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className="grid grid-cols-5 gap-4 items-center px-6 py-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                {patient.avatar}
              </div>
              <span className="font-medium text-gray-900">
                {patient.name}
              </span>
            </div>

            <div className="text-gray-700">{patient.age}</div>
            <div className="text-gray-700">{patient.phone}</div>
            <div className="text-gray-700">{patient.diagnosis}</div>
            <div className={`font-semibold ${patient.statusColor}`}>
              {patient.status}
            </div>
          </div>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Hech narsa topilmadi
        </div>
      )}
    </div>
  )
}
