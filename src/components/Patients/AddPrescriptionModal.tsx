import { useState } from 'react';
import { PrescriptionCreate } from '../../types/prescription';
import { addPrescription } from '../../api/prescriptions';

interface AddPrescriptionModalProps {
  patientId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const AddPrescriptionModal = ({ patientId, onClose, onSuccess }: AddPrescriptionModalProps) => {
  const [formData, setFormData] = useState<PrescriptionCreate>({
    medication_name: '',
    dosage: '',
    frequency: '',
    duration: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.medication_name || !formData.dosage || !formData.frequency || !formData.duration) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await addPrescription(patientId, formData);
      onSuccess();
    } catch (err) {
      console.error('Error adding prescription:', err);
      setError('Не удалось добавить рецепт');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-[#1D1D2B] mb-4">Добавить рецепт</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название препарата *
            </label>
            <input
              type="text"
              value={formData.medication_name}
              onChange={(e) => setFormData({ ...formData, medication_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Например: Амоксициллин"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Дозировка *
            </label>
            <input
              type="text"
              value={formData.dosage}
              onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Например: 500 мг"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Частота приёма *
            </label>
            <input
              type="text"
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Например: 3 раза в день"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Длительность *
            </label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Например: 7 дней"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Примечания
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Дополнительные инструкции..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPrescriptionModal;
