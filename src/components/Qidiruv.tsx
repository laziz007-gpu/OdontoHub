import { useState } from 'react'
import { Search, Plus, Filter, Phone, Activity } from 'lucide-react'

interface FilterState {
  status: string
  minAge: string
  maxAge: string
}

interface Props {
  searchQuery: string
  setSearchQuery: (value: string) => void
  onAdd: (data: { name: string; phone: string; diagnosis: string }) => void
  onApplyFilter: (filters: FilterState) => void
}

export default function Qidiruv({ searchQuery, setSearchQuery, onAdd, onApplyFilter }: Props) {
  const [showFilter, setShowFilter] = useState(false)
  const [showAdd, setShowAdd] = useState(false)

  // Local state for the filter popup
  const [minAge, setMinAge] = useState('')
  const [maxAge, setMaxAge] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')

  // Local state for add popup
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newDiagnosis, setNewDiagnosis] = useState('')

  const handleApply = () => {
    onApplyFilter({
      status: selectedStatus,
      minAge,
      maxAge
    })
    setShowFilter(false)
  }

  const handleAddClick = () => {
    if (newName.trim()) {
      onAdd({
        name: newName,
        phone: newPhone,
        diagnosis: newDiagnosis
      })

      // Reset form
      setNewName('')
      setNewPhone('')
      setNewDiagnosis('')
      setShowAdd(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 mb-6 shadow-sm relative">
        <div className="flex items-center flex-1 gap-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Найти"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowAdd(!showAdd)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${showAdd ? 'bg-gray-700' : 'bg-gray-900'
              } hover:bg-gray-800 text-white`}
          >
            <Plus className="w-5 h-5" />
          </button>

          {showAdd && (
            <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 w-80 z-20">
              <h3 className="text-xl font-bold mb-4">Добавить Пациента</h3>

              <div className="space-y-3 mb-6">
                <div className="bg-gray-100 rounded-xl px-4 py-3 flex items-center gap-2">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Имя пациента"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400 text-sm"
                    autoFocus
                  />
                </div>

                <div className="bg-gray-100 rounded-xl px-4 py-3 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Номер телефона"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400 text-sm"
                  />
                </div>

                <div className="bg-gray-100 rounded-xl px-4 py-3 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Диагноз"
                    value={newDiagnosis}
                    onChange={(e) => setNewDiagnosis(e.target.value)}
                    className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400 text-sm"
                  />
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-3 flex items-center gap-3 mb-6 bg-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80"
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="overflow-hidden">
                  <div className="font-bold text-gray-900 line-clamp-1 text-sm">
                    {newName || 'Имя пациента'}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {newDiagnosis || 'Диагноз не указан'}
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddClick}
                className="w-full bg-[#1e2532] text-white rounded-full py-3 font-medium hover:bg-[#2c3545] transition-colors"
              >
                Добавить
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${showFilter ? 'bg-blue-600' : 'bg-gray-900'
              }`}
          >
            <Filter className="w-5 h-5 text-white" />
          </button>

          {showFilter && (
            <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 w-80 z-20">
              <h3 className="text-xl font-bold mb-4">Фильтр</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Возраст</label>
                <div className="flex gap-3">
                  <div className="bg-gray-200 rounded-full px-4 py-2 flex-1">
                    <input
                      type="number"
                      placeholder="От"
                      value={minAge}
                      onChange={(e) => setMinAge(e.target.value)}
                      className="bg-transparent w-full outline-none text-sm placeholder-gray-500"
                    />
                  </div>
                  <div className="bg-gray-200 rounded-full px-4 py-2 flex-1">
                    <input
                      type="number"
                      placeholder="До"
                      value={maxAge}
                      onChange={(e) => setMaxAge(e.target.value)}
                      className="bg-transparent w-full outline-none text-sm placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Статус</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedStatus(selectedStatus === 'ЛЕЧИТСЯ' ? 'All' : 'ЛЕЧИТСЯ')}
                    className={`px-4 py-2 rounded-xl text-sm transition-colors border font-medium ${selectedStatus === 'ЛЕЧИТСЯ'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'
                      }`}
                  >
                    Лечится
                  </button>
                  <button
                    onClick={() => setSelectedStatus(selectedStatus === 'НОВЫЙ' ? 'All' : 'НОВЫЙ')}
                    className={`px-4 py-2 rounded-xl text-sm transition-colors border font-medium ${selectedStatus === 'НОВЫЙ'
                        ? 'bg-green-500 text-white border-green-500'
                        : 'bg-white text-green-600 border-green-200 hover:bg-green-50'
                      }`}
                  >
                    Новый
                  </button>
                  <button
                    onClick={() => setSelectedStatus(selectedStatus === 'ЗАПИСАН' ? 'All' : 'ЗАПИСАН')}
                    className={`px-4 py-2 rounded-xl text-sm transition-colors border font-medium ${selectedStatus === 'ЗАПИСАН'
                        ? 'bg-gray-800 text-white border-gray-800'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    Записан
                  </button>
                </div>
              </div>

              <button
                onClick={handleApply}
                className="w-full bg-[#1e2532] text-white rounded-full py-3 font-medium hover:bg-[#2c3545] transition-colors"
              >
                Применить
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
