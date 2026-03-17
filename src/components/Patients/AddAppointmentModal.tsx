import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateAppointment } from '../../api/appointments';
import { useServices } from '../../api/services';
import { ChevronDown, Calendar, Clock, X, Check, Plus } from 'lucide-react';

interface AddAppointmentModalProps {
  patientId: number;
  dentistId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const AddAppointmentModal = ({ patientId, dentistId, onClose, onSuccess }: AddAppointmentModalProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    start_time: '',
    service: '',
    notes: ''
  });
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const serviceRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const createAppointment = useCreateAppointment();
  const { data: services, isLoading: servicesLoading } = useServices();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (serviceRef.current && !serviceRef.current.contains(event.target as Node)) {
        setIsServiceOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.start_time) {
      setError(t('modals.appointment.error_time'));
      return;
    }

    try {
      setError(null);
      await createAppointment.mutateAsync({
        dentist_id: dentistId,
        patient_id: patientId,
        start_time: formData.start_time,
        service: formData.service || undefined,
        notes: formData.notes || undefined
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error creating appointment:', err);
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : t('modals.appointment.error_save'));
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/20 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/40 p-10 w-full max-w-lg transform animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black text-[#1a1f36] tracking-tight">{t('modals.appointment.title')}</h2>
            <p className="text-gray-400 font-bold mt-1 text-sm">Заполните детали визита</p>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-[#1a1f36] hover:bg-gray-100 rounded-2xl transition-all duration-300 group"
          >
            <X className="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-100 text-red-600 p-5 rounded-2xl mb-8 flex items-center gap-4 animate-in slide-in-from-top-4">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="font-bold text-sm tracking-tight">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Date & Time Picker */}
          <div className="group">
            <label className="block text-sm font-black text-[#1a1f36] mb-3 ml-1 uppercase tracking-wider opacity-60">
              {t('modals.appointment.start_time')}
            </label>
            <div className="relative">
              <input
                type="datetime-local"
                value={formData.start_time}
                onClick={(e) => {
                  try {
                    // @ts-ignore
                    e.currentTarget.showPicker();
                  } catch (err) {
                    e.currentTarget.focus();
                  }
                }}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="w-full pl-14 pr-6 py-5 bg-[#f8f9fc] border-2 border-transparent rounded-[24px] focus:bg-white focus:border-[#4f6bff] focus:shadow-[0_0_0_8px_rgba(79,107,255,0.05)] transition-all outline-none font-bold text-[#1a1f36] text-lg cursor-pointer appearance-none"
              />
              <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-[#4f6bff] transition-colors" />
            </div>
          </div>

          {/* Premium Service Selector */}
          <div className="relative" ref={serviceRef}>
            <label className="block text-sm font-black text-[#1a1f36] mb-3 ml-1 uppercase tracking-wider opacity-60">
              {t('modals.appointment.service')}
            </label>
            <div
              onClick={() => !servicesLoading && setIsServiceOpen(!isServiceOpen)}
              className={`w-full h-[68px] flex items-center justify-between px-6 bg-[#f8f9fc] border-2 rounded-[24px] cursor-pointer transition-all hover:bg-white ${isServiceOpen ? 'border-[#4f6bff] bg-white shadow-[0_0_0_8px_rgba(79,107,255,0.05)]' : 'border-transparent'
                }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${formData.service ? 'bg-[#4f6bff]/10 text-[#4f6bff]' : 'bg-gray-100 text-gray-400'}`}>
                  <Clock size={20} />
                </div>
                <span className={`text-lg font-bold ${formData.service ? 'text-[#1a1f36]' : 'text-gray-400'}`}>
                  {formData.service || t('modals.appointment.select_service') || 'Выберите услугу'}
                </span>
              </div>
              <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isServiceOpen ? 'rotate-180 text-[#4f6bff]' : ''}`} />
            </div>

            {isServiceOpen && (
              <div className="absolute top-[calc(100%+10px)] left-0 right-0 bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 z-[60] py-3 animate-in fade-in slide-in-from-top-2 duration-300 max-h-[300px] overflow-y-auto custom-scrollbar">
                {services && services.length > 0 ? (
                  services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => {
                        setFormData({ ...formData, service: service.name });
                        setIsServiceOpen(false);
                      }}
                      className="px-6 py-4 hover:bg-[#4f6bff]/5 cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-[#1a1f36] transition-colors group-hover:text-[#4f6bff]">{service.name}</span>
                        <span className="text-sm font-bold text-gray-400">
                          {service.price} {service.currency}
                        </span>
                      </div>
                      {formData.service === service.name && (
                        <div className="w-8 h-8 bg-[#4f6bff] rounded-full flex items-center justify-center">
                          <Check size={16} className="text-white" />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center">
                    <p className="text-gray-400 font-bold">{t('modals.appointment.no_services') || 'Услуги не найдены'}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-black text-[#1a1f36] mb-3 ml-1 uppercase tracking-wider opacity-60">
              {t('modals.appointment.notes')}
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-6 py-5 bg-[#f8f9fc] border-2 border-transparent rounded-[24px] focus:bg-white focus:border-[#4f6bff] focus:shadow-[0_0_0_8px_rgba(79,107,255,0.05)] transition-all outline-none min-h-[140px] resize-none font-bold text-[#1a1f36] text-lg hover:bg-gray-100/50"
              placeholder={t('modals.appointment.placeholder_notes')}
            />
          </div>

          <div className="flex gap-5 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-[68px] px-8 bg-gray-50 text-gray-500 font-bold rounded-[24px] hover:bg-gray-100 hover:text-[#1a1f36] transition-all duration-300"
              disabled={createAppointment.isPending}
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="flex-[2] h-[68px] px-8 bg-[#00e396] text-white font-black text-xl rounded-[24px] shadow-[0_10px_25px_rgba(0,227,150,0.3)] hover:shadow-[0_15px_30px_rgba(0,227,150,0.4)] hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 flex items-center justify-center gap-3"
              disabled={createAppointment.isPending}
            >
              {createAppointment.isPending ? (
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{t('common.saving')}</span>
                </div>
              ) : (
                <>
                  <Plus size={24} />
                  <span>{t('common.add')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add styles for the custom scrollbar
const style = document.createElement('style');
style.textContent = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #cbd5e0;
  }
`;
document.head.appendChild(style);

export default AddAppointmentModal;

