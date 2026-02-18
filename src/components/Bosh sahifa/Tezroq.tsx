import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../Routes/path';
import AppointmentModal from '../Appointments/AppointmentModal';
import AddPatientModal from '../Patients/AddPatientModal';
import AddNoteModal from '../Patients/AddNoteModal';

// Action turi
type Action = {
  titleKey: string;
  action: 'appointment' | 'patient' | 'note' | 'message';
};

const Tezroq: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  const actions: Action[] = [
    { titleKey: "dashboard.quick_actions.add_appointment", action: 'appointment' },
    { titleKey: "dashboard.quick_actions.new_note", action: 'note' },
    { titleKey: "dashboard.quick_actions.message_patient", action: 'message' },
    { titleKey: "dashboard.quick_actions.add_patient", action: 'patient' }
  ];

  const handleActionClick = (action: Action) => {
    switch (action.action) {
      case 'appointment':
        setIsAppointmentModalOpen(true);
        break;
      case 'patient':
        setIsPatientModalOpen(true);
        break;
      case 'note':
        setIsNoteModalOpen(true);
        break;
      case 'message':
        alert('Функция в разработке');
        break;
    }
  };

  const handleNoteSuccess = (patientId: number, note: string) => {
    // Save note to localStorage
    const notesKey = `patient_notes_${patientId}`;
    const existingNotes = localStorage.getItem(notesKey);
    const notes = existingNotes ? JSON.parse(existingNotes) : [];
    
    notes.push({
      id: Date.now(),
      text: note,
      date: new Date().toISOString(),
      createdBy: 'Врач' // TODO: Get from current user
    });
    
    localStorage.setItem(notesKey, JSON.stringify(notes));
    
    alert('Заметка успешно добавлена');
    // Navigate to patient profile
    navigate(`${paths.patient}/${patientId}`);
  };

  return (
    <div>
      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-bold mb-6">{t('dashboard.quick_actions.title')}</h2>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleActionClick(action)}
              className="bg-gray-50 hover:bg-gray-100 rounded-2xl p-6 text-center transition-colors relative"
            >
              <p className="font-semibold text-gray-900">{t(action.titleKey)}</p>
              {action.action === 'message' && (
                <span className="absolute top-2 right-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                  В разработке
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Modals */}
      <AppointmentModal 
        isOpen={isAppointmentModalOpen} 
        onClose={() => setIsAppointmentModalOpen(false)}
        onSuccess={() => {
          setIsAppointmentModalOpen(false);
          navigate(paths.appointments);
        }}
      />
      
      <AddPatientModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSuccess={() => {
          setIsPatientModalOpen(false);
          navigate(paths.patient);
        }}
      />

      <AddNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSuccess={handleNoteSuccess}
      />
    </div>
  );
}

export default Tezroq;