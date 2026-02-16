import { useState, useMemo, type FC } from 'react'
import Qidiruv from "../components/Bosh sahifa/Qidiruv"
import PatientsTable from "../components/Bosh sahifa/PatsentTable"
import Rasm from "../assets/img/photos/Subtract.png"
import { type Patient } from '../data/patients'
import { useTranslation } from 'react-i18next'
import { useAllPatients, useCreatePatient } from '../api/profile'

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

  const { data: apiPatients, isLoading } = useAllPatients()
  const createPatientMutation = useCreatePatient()

  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return 25;
    const birth = new Date(birthDate);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  const patients = useMemo(() => {
    if (!apiPatients || !Array.isArray(apiPatients)) return [];
    return apiPatients.map((p: any) => ({
      id: p.id,
      name: p.full_name || 'No Name',
      age: calculateAge(p.birth_date),
      phone: p.phone || '',
      diagnosis: p.source || 'Checkup', // Using source as a placeholder for diagnosis if not available
      status: 'НОВЫЙ', // Default status for API patients for now
      statusColor: 'text-green-600',
      img: Rasm // Default image
    })) as Patient[];
  }, [apiPatients]);

  const handleAddPatient = async (data: { name: string; phone: string; diagnosis: string }) => {
    try {
      await createPatientMutation.mutateAsync({
        full_name: data.name,
        phone: data.phone,
        source: data.diagnosis // Using diagnosis as source for now
      });
      alert(t('patients_list.new_patient_added'))
    } catch (error: any) {
      console.error("Failed to add patient", error);
      const errorMessage = error.response?.data?.detail || "Failed to add patient";
      alert(errorMessage);
    }
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

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

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
