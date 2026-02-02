import { useState, type FC } from 'react'
import Qidiruv from "../components/Qidiruv"
import PatientsTable from "../components/PatsentTable"
import Rasm from "../assets/img/photos/Subtract.png"
import { initialPatients, type Patient } from '../data/patients'
import { useTranslation } from 'react-i18next'

interface Filters {
  status: string;
  minAge: string;
  maxAge: string;
}

const Patsant: FC = () => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filters, setFilters] = useState<Filters>({
    status: 'All',
    minAge: '',
    maxAge: ''
  })

  const [patients, setPatients] = useState<Patient[]>(initialPatients)

  const handleAddPatient = (data: { name: string; phone: string; diagnosis: string }) => {
    // Basic implementation to add a new patient
    const newPatient: Patient = {
      id: patients.length + 1,
      name: data.name || t('patients_list.defaults.new_patient'),
      age: 25, // Default age
      phone: data.phone || '+998 90 000 00 00',
      diagnosis: data.diagnosis || t('patients_list.defaults.checkup'),
      status: 'НОВЫЙ', // Logic uses Russian values for now, will handle in table
      statusColor: 'text-green-600',
      img: Rasm // Default image
    }
    setPatients([...patients, newPatient])
    alert(t('patients_list.new_patient_added'))
  }

  const filteredPatients = patients.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      p.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filters.status === 'All' || p.status === filters.status

    let matchesAge = true
    if (filters.minAge) matchesAge = matchesAge && p.age >= parseInt(filters.minAge)
    if (filters.maxAge) matchesAge = matchesAge && p.age <= parseInt(filters.maxAge)

    return matchesSearch && matchesStatus && matchesAge
  })

  return (
    <div>
      <Qidiruv
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAdd={handleAddPatient}
        onApplyFilter={setFilters}
      />

      <PatientsTable patients={filteredPatients} />
    </div>
  )
}

export default Patsant
