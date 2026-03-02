import { useState, useEffect } from 'react';
import { getPatientAppointments, type Appointment } from '../../api/appointments';
import AddAppointmentModal from './AddAppointmentModal';
import { useTranslation } from 'react-i18next';

interface AppointmentsSectionProps {
  patientId: number;
  dentistId: number;
}

const AppointmentsSection = ({ patientId, dentistId }: AppointmentsSectionProps) => {
  const { t, i18n } = useTranslation();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, [patientId]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await getPatientAppointments(patientId);
      setAppointments(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(t('patient_detail.appointments.error_load'));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = i18n.language === 'ru' ? 'ru-RU' : i18n.language === 'uz' ? 'uz-UZ' : i18n.language === 'kz' ? 'kk-KZ' : 'en-US';
    return date.toLocaleDateString(locale, {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'pending': t('patient_detail.appointments.statuses.pending'),
      'confirmed': t('patient_detail.appointments.statuses.confirmed'),
      'completed': t('patient_detail.appointments.statuses.completed'),
      'cancelled': t('patient_detail.appointments.statuses.cancelled'),
      'moved': t('patient_detail.appointments.statuses.moved')
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'moved': 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">{t('patient_detail.appointments.title')}</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          + {t('patient_detail.appointments.add_btn')}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500">{t('patient_detail.appointments.no_records')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{appointment.service || t('patient_detail.appointments.appointment')}</div>
                  <div className="text-sm text-gray-600 mt-1">{formatDate(appointment.start_time)}</div>
                  {appointment.notes && (
                    <div className="text-sm text-gray-500 mt-1">{appointment.notes}</div>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                  {getStatusLabel(appointment.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddAppointmentModal
          patientId={patientId}
          dentistId={dentistId}
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchAppointments}
        />
      )}
    </div>
  );
};

export default AppointmentsSection;
