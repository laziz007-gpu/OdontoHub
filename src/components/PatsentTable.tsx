

import { Link } from 'react-router-dom'

interface Patient {
  id: number
  name: string
  age: number
  phone: string
  diagnosis: string
  status: string
  statusColor: string
  img: string
}

interface Props {
  patients: Patient[]
}

export default function PatientsTable({ patients }: Props) {
  // Filtering logic moved to parent


  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-5 px-6 py-3 bg-white border-b text-sm font-medium text-gray-600">
        <div>Имя</div>
        <div>Возраст</div>
        <div>Номер</div>
        <div>Диагноз</div>
        <div>Статус</div>
      </div>

      <div className="space-y-2 mt-2">
        {patients.map(p => (
          <div
            key={p.id}
            className="grid grid-cols-5 items-center px-6 py-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow relative"
          >
            <Link to={`/patsent/${p.id}`} className="absolute inset-0 z-10" />
            <div className="flex items-center gap-4">
              <img
                src={p.img}
                className="w-16 h-16 rounded-full object-cover"
                alt={p.name}
              />
              <span className="font-medium">{p.name}</span>
            </div>

            <div>{p.age}</div>
            <div>{p.phone}</div>
            <div>{p.diagnosis}</div>
            <div className={`font-semibold ${p.statusColor}`}>
              {p.status}
            </div>
          </div>
        ))}
      </div>

      {patients.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Ничего не найдено
        </div>
      )}
    </div>
  )
}
