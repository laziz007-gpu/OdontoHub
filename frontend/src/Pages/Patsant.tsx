import { useState, useMemo, type FC } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Qidiruv from "../components/Bosh sahifa/Qidiruv"
import PatientsTable from "../components/Bosh sahifa/PatsentTable"
import Rasm from "../assets/img/photos/Subtract.png"
import { type Patient } from '../data/patients'
import { useTranslation } from 'react-i18next'
import { useAllPatients, useCreatePatient } from '../api/profile'
import { toast } from '../components/Shared/Toast'
import { paths } from '../Routes/path'

interface Filters {
  status: string;
  minAge: string;
  maxAge: string;
}

const Patsant: FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
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
    return apiPatients.map((p: any) => {
      const status = p.status || 'НОВЫЙ';
      let statusColor = 'text-green-600';
      
      if (status === 'ЛЕЧИТСЯ') {
        statusColor = 'text-blue-600';
      } else if (status === 'ЗАПИСАН') {
        statusColor = 'text-gray-600';
      }
      
      return {
        id: p.id,
        name: p.full_name || 'No Name',
        age: calculateAge(p.birth_date),
        phone: p.phone || '',
        diagnosis: p.source === 'doctor_added' ? 'Konsultatsiya' : (p.source || 'Checkup'),
        status: status,
        statusColor: statusColor,
        img: Rasm
      };
    }) as Patient[];
  }, [apiPatients]);

  const handleAddPatient = async (data: { name: string; phone: string; diagnosis: string }) => {
    try {
      await createPatientMutation.mutateAsync({
        full_name: data.name,
        phone: data.phone,
        source: data.diagnosis // Using diagnosis as source for now
      });
      toast.success(t('patients_list.new_patient_added'))
    } catch (error: any) {
      console.error("Failed to add patient", error);
      const errorMessage = error.response?.data?.detail || "Failed to add patient";
      toast.error(errorMessage);
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 pt-4 sm:pt-6 lg:pt-8 pb-6">
        <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-6">
          <button
            type="button"
            onClick={() => navigate(paths.menu)}
            className="p-1.5 sm:p-2.5 text-[#1e2235] hover:bg-white rounded-xl transition-colors shrink-0"
            aria-label="Orqaga qaytish"
          >
            <ArrowLeft size={20} className="sm:size-6" />
          </button>
          <h1 className="text-xl sm:text-3xl font-black text-[#1e2235] leading-tight flex-1">
            {t('sidebar.patients')}
          </h1>
        </div>

        <Qidiruv
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onAdd={handleAddPatient}
          onApplyFilter={setFilters}
        />

        <PatientsTable patients={filteredPatients} />
      </div>
    </div>
  )
}

export default Patsant
