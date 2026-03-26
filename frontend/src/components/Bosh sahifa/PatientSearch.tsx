import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAllPatients } from '../../api/profile';
import { Loader2 } from 'lucide-react';

interface PatientSearchProps {
  searchQuery: string;
}

export default function PatientSearch({ searchQuery }: PatientSearchProps) {
  const { data: patients, isLoading } = useAllPatients();

  const filteredPatients = useMemo(() => {
    if (!searchQuery || !patients || !Array.isArray(patients)) return [];
    
    const query = searchQuery.toLowerCase();
    return patients.filter((p: any) =>
      p.full_name?.toLowerCase().includes(query) ||
      p.phone?.includes(query) ||
      p.source?.toLowerCase().includes(query)
    );
  }, [patients, searchQuery]);

  if (!searchQuery) return null;

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (filteredPatients.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Результаты поиска</h2>
        <p className="text-gray-500 text-center py-8">
          Пациенты не найдены по запросу "{searchQuery}"
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
        Результаты поиска
        <span className="bg-black text-white text-sm px-3 py-1 rounded-full font-semibold">
          {filteredPatients.length}
        </span>
      </h2>

      <div className="space-y-4">
        {filteredPatients.map((patient: any) => (
          <Link
            key={patient.id}
            to={`/patients/${patient.id}`}
            className="block bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
                {patient.full_name?.charAt(0) || 'П'}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-lg">
                  {patient.full_name || 'Без имени'}
                </p>
                <div className="space-y-1 text-sm text-gray-600 mt-2">
                  {patient.phone && (
                    <p>📱 {patient.phone}</p>
                  )}
                  {patient.source && (
                    <p>📋 {patient.source}</p>
                  )}
                  {patient.birth_date && (
                    <p>🎂 {new Date(patient.birth_date).toLocaleDateString('ru-RU')}</p>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
