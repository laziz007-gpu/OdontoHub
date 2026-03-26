import { useState } from 'react';
import { useCreateAppointment } from '../../api/appointments';

interface AddAppointmentModalProps {
  patientId: number;
  dentistId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const AddAppointmentModal = ({ patientId, dentistId, onClose, onSuccess }: AddAppointmentModalProps) => {
  const [formData, setFormData] = useState({
    start_time: '',
    end_time: '',
    service: '',
    notes: ''
  });
  const [error, setError] = useState<string | null>(null);
  const createAppointment = useCreateAppointment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.start_time || !formData.end_time) {
      setError('Укажите время начала и окончания');
      return;
    }

    try {
      setError(null);
      await createAppointment.mutateAsync({
        dentist_id: dentistId,
        patient_id: patientId,
        start_time: formData.start_time,
        end_time: formData.end_time,
        service: formData.service || undefined,
        notes: formData.notes || undefined
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error creating appointment:', err);
      setError('Не удалось добавить приём');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Добавить приём</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Время начала *
            </label>
            <input
              type="datetime-local"
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Время окончания *
            </label>
            <input
              type="datetime-local"
              value={formData.end_time}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Услуга
            </label>
            <input
              type="text"
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Например: Консультация"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Примечания
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Дополнительная информация..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={createAppointment.isPending}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              disabled={createAppointment.isPending}
            >
              {createAppointment.isPending ? 'Добавление...' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAppointmentModal;
