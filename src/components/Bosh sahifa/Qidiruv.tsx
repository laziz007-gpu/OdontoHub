import { useState } from 'react'
import { Search, Plus, Filter, Phone, Activity } from 'lucide-react'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
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
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white rounded-lg px-4 py-3 mb-6 shadow-sm relative">
        <div className="flex items-center flex-1 gap-2">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder={t('dashboard.qidiruv.search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm sm:text-base"
          />
        </div>

        <div className="flex items-center justify-end gap-3 sm:gap-4 mt-2 sm:mt-0">
          <div className="relative">
            <button
              onClick={() => {
                setShowAdd(!showAdd)
                setShowFilter(false)
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${showAdd ? 'bg-gray-700' : 'bg-gray-900'
                } hover:bg-gray-800 text-white`}
            >
              <Plus className="w-5 h-5" />
            </button>

            {showAdd && (
              <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 w-[280px] sm:w-80 z-20">
                <h3 className="text-xl font-bold mb-4">{t('dashboard.qidiruv.add_title')}</h3>

                <div className="space-y-3 mb-6">
                  <div className="bg-gray-100 rounded-xl px-4 py-3 flex items-center gap-2">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder={t('dashboard.qidiruv.name_placeholder')}
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
                      placeholder={t('dashboard.qidiruv.phone_placeholder')}
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400 text-sm"
                    />
                  </div>

                  <div className="bg-gray-100 rounded-xl px-4 py-3 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder={t('dashboard.qidiruv.diagnosis_placeholder')}
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
                      {newName || t('dashboard.qidiruv.name_placeholder')}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {newDiagnosis || t('dashboard.qidiruv.not_specified')}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAddClick}
                  className="w-full bg-[#1e2532] text-white rounded-full py-3 font-medium hover:bg-[#2c3545] transition-colors"
                >
                  {t('dashboard.qidiruv.add_button')}
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setShowFilter(!showFilter)
                setShowAdd(false)
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${showFilter ? 'bg-blue-600' : 'bg-gray-900'
                }`}
            >
              <Filter className="w-5 h-5 text-white" />
            </button>

            {showFilter && (
              <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 w-[280px] sm:w-80 z-20">
                <h3 className="text-xl font-bold mb-4">{t('dashboard.qidiruv.filter_title')}</h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">{t('dashboard.qidiruv.age_label')}</label>
                  <div className="flex gap-3">
                    <div className="bg-gray-200 rounded-full px-4 py-2 flex-1">
                      <input
                        type="number"
                        placeholder={t('dashboard.qidiruv.age_from')}
                        value={minAge}
                        onChange={(e) => setMinAge(e.target.value)}
                        className="bg-transparent w-full outline-none text-sm placeholder-gray-500"
                      />
                    </div>
                    <div className="bg-gray-200 rounded-full px-4 py-2 flex-1">
                      <input
                        type="number"
                        placeholder={t('dashboard.qidiruv.age_to')}
                        value={maxAge}
                        onChange={(e) => setMaxAge(e.target.value)}
                        className="bg-transparent w-full outline-none text-sm placeholder-gray-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">{t('dashboard.qidiruv.status_label')}</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedStatus(selectedStatus === 'ЛЕЧИТСЯ' ? 'All' : 'ЛЕЧИТСЯ')}
                      className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm transition-colors border font-medium ${selectedStatus === 'ЛЕЧИТСЯ'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'
                        }`}
                    >
                      {t('dashboard.qidiruv.status_treating')}
                    </button>
                    <button
                      onClick={() => setSelectedStatus(selectedStatus === 'НОВЫЙ' ? 'All' : 'НОВЫЙ')}
                      className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm transition-colors border font-medium ${selectedStatus === 'НОВЫЙ'
                        ? 'bg-green-500 text-white border-green-500'
                        : 'bg-white text-green-600 border-green-200 hover:bg-green-50'
                        }`}
                    >
                      {t('dashboard.qidiruv.status_new')}
                    </button>
                    <button
                      onClick={() => setSelectedStatus(selectedStatus === 'ЗАПИСАН' ? 'All' : 'ЗАПИСАН')}
                      className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm transition-colors border font-medium ${selectedStatus === 'ЗАПИСАН'
                        ? 'bg-gray-800 text-white border-gray-800'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      {t('dashboard.qidiruv.status_recorded')}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleApply}
                  className="w-full bg-[#1e2532] text-white rounded-full py-3 font-medium hover:bg-[#2c3545] transition-colors"
                >
                  {t('dashboard.qidiruv.apply_button')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
