import { useState, useEffect } from 'react';
import { Prescription } from '../../types/prescription';
import { getPrescriptions, deletePrescription } from '../../api/prescriptions';
import AddPrescriptionModal from './AddPrescriptionModal';
import EditPrescriptionModal from './EditPrescriptionModal';

interface PrescriptionSectionProps {
  patientId: number;
}

const PrescriptionSection = ({ patientId }: PrescriptionSectionProps) => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);

  useEffect(() => {
    fetchPrescriptions();
  }, [patientId]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const data = await getPrescriptions(patientId);
      setPrescriptions(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
      setError('Не удалось загрузить рецепты');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (prescriptionId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот рецепт?')) {
      return;
    }

    try {
      await deletePrescription(patientId, prescriptionId);
      setPrescriptions(prev => prev.filter(p => p.id !== prescriptionId));
    } catch (err) {
      console.error('Error deleting prescription:', err);
      alert('Не удалось удалить рецепт');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return <div className="text-center py-4">Загрузка...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-[#1D1D2B]">Рецепты</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Добавить рецепт
        </button>
      </div>

      {prescriptions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Нет рецептов
        </div>
      ) : (
        <div className="space-y-3">
          {prescriptions.map((prescription) => (
            <div
              key={prescription.id}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-[#1D1D2B]">
                    {prescription.medication_name}
                  </h4>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Дозировка:</span> {prescription.dosage}</p>
                    <p><span className="font-medium">Частота:</span> {prescription.frequency}</p>
                    <p><span className="font-medium">Длительность:</span> {prescription.duration}</p>
                    {prescription.notes && (
                      <p><span className="font-medium">Примечания:</span> {prescription.notes}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      Назначено: {formatDate(prescription.prescribed_at)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => setEditingPrescription(prescription)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(prescription.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddPrescriptionModal
          patientId={patientId}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchPrescriptions();
          }}
        />
      )}

      {editingPrescription && (
        <EditPrescriptionModal
          prescription={editingPrescription}
          patientId={patientId}
          onClose={() => setEditingPrescription(null)}
          onSuccess={() => {
            setEditingPrescription(null);
            fetchPrescriptions();
          }}
        />
      )}
    </div>
  );
};

export default PrescriptionSection;
