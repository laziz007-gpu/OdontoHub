import { useState } from 'react';
import { AllergyCreate, AllergySeverity } from '../../types/allergy';
import { addAllergy } from '../../api/allergies';

interface AddAllergyModalProps {
  patientId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const AddAllergyModal = ({ patientId, onClose, onSuccess }: AddAllergyModalProps) => {
  const [formData, setFormData] = useState<AllergyCreate>({
    allergen_name: '',
    reaction_type: '',
    severity: 'mild',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.allergen_name || !formData.reaction_type) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await addAllergy(patientId, formData);
      onSuccess();
    } catch (err) {
      console.error('Error adding allergy:', err);
      setError('Не удалось добавить аллергию');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-[#1D1D2B] mb-4">Добавить аллергию</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Аллерген *
            </label>
            <input
              type="text"
              value={formData.allergen_name}
              onChange={(e) => setFormData({ ...formData, allergen_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Например: Пенициллин"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Тип реакции *
            </label>
            <input
              type="text"
              value={formData.reaction_type}
              onChange={(e) => setFormData({ ...formData, reaction_type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Например: Сыпь, отек"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Степень тяжести *
            </label>
            <select
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value as AllergySeverity })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="mild">Легкая</option>
              <option value="moderate">Средняя</option>
              <option value="severe">Тяжелая</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Примечания
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={3}
              placeholder="Дополнительная информация..."
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
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
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

export default AddAllergyModal;
