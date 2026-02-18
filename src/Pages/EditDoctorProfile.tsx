import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, MapPin, ChevronDown, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDentistProfile, useUpdateDentistProfile } from '../api/profile';
import DentistImg from '../assets/img/photos/Dentist.png';

export default function EditDoctorProfile() {
  const navigate = useNavigate();
  const { data: dentist, refetch } = useDentistProfile();
  const updateProfile = useUpdateDentistProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [mapAddress, setMapAddress] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: 41.2995, lng: 69.2401 }); // Tashkent default
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  const [formData, setFormData] = useState({
    specialization: '',
    phone: '',
    address: '',
    clinic: '',
    schedule: 'Каждый день',
    workStartHour: '08',
    workStartMinute: '00',
    workEndHour: '16',
    workEndMinute: '00',
    telegram: '',
    instagram: '',
    whatsapp: '',
  });

  // Обновляем formData когда приходят данные с сервера
  useEffect(() => {
    if (dentist) {
      const workHours = dentist.work_hours?.split('-') || ['08:00', '16:00'];
      const [startHour, startMinute] = workHours[0]?.split(':') || ['08', '00'];
      const [endHour, endMinute] = workHours[1]?.split(':') || ['16', '00'];

      setFormData({
        specialization: dentist.specialization || 'Хирург',
        phone: dentist.phone || '',
        address: dentist.address || '',
        clinic: dentist.clinic || '',
        schedule: dentist.schedule || 'Каждый день',
        workStartHour: startHour,
        workStartMinute: startMinute,
        workEndHour: endHour,
        workEndMinute: endMinute,
        telegram: dentist.telegram || '',
        instagram: dentist.instagram || '',
        whatsapp: dentist.whatsapp || '',
      });
    }
  }, [dentist]);

  const [avatar, setAvatar] = useState<string>(DentistImg);

  const specializations = [
    'Хирург',
    'Терапевт',
    'Ортодонт',
    'Ортопед',
    'Пародонтолог',
    'Имплантолог'
  ];

  const scheduleOptions = [
    'Каждый день',
    'Будние дни',
    'Выходные',
    'Понедельник - Пятница',
    'Индивидуальный график'
  ];

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
    }
  };

  const handleMapClick = () => {
    setMapAddress(formData.address);
    setIsMapModalOpen(true);
  };

  const handleMapConfirm = () => {
    setFormData({ ...formData, address: mapAddress });
    setIsMapModalOpen(false);
  };

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({
        specialization: formData.specialization,
        phone: formData.phone,
        address: formData.address,
        clinic: formData.clinic,
        schedule: formData.schedule,
        work_hours: `${formData.workStartHour}:${formData.workStartMinute}-${formData.workEndHour}:${formData.workEndMinute}`,
        telegram: formData.telegram,
        instagram: formData.instagram,
        whatsapp: formData.whatsapp,
      });
      
      // Обновляем данные профиля
      await refetch();
      
      // Показываем уведомление
      setShowSuccessNotification(true);
      setTimeout(() => {
        setShowSuccessNotification(false);
        navigate('/profile');
      }, 2000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Ошибка при сохранении профиля');
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F6FB] p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/profile')}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold">Редактирование</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Specialization */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Специализация</label>
              <div className="relative">
                <select
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full h-14 bg-white border-2 border-blue-200 rounded-2xl px-4 text-lg font-semibold appearance-none cursor-pointer focus:outline-none focus:border-blue-400"
                >
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Телефонный номер</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, '');
                  if (val.startsWith('998')) {
                    val = val.slice(0, 12);
                  } else {
                    val = val.slice(0, 9);
                  }
                  setFormData({ ...formData, phone: val });
                }}
                onBlur={(e) => {
                  let val = e.target.value.replace(/\D/g, '');
                  if (val && !val.startsWith('998')) {
                    val = '998' + val;
                  }
                  if (val.length === 12) {
                    const formatted = `+${val.slice(0, 3)} ${val.slice(3, 5)} ${val.slice(5, 8)} ${val.slice(8, 10)} ${val.slice(10, 12)}`;
                    setFormData({ ...formData, phone: formatted });
                  }
                }}
                className="w-full h-14 bg-white border-2 border-blue-200 rounded-2xl px-4 text-lg font-semibold focus:outline-none focus:border-blue-400"
                placeholder="+998 93 123 45 67"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Адрес</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  onClick={handleMapClick}
                  className="w-full h-14 bg-white border-2 border-blue-200 rounded-2xl px-4 pr-12 text-lg font-semibold focus:outline-none focus:border-blue-400 cursor-pointer"
                  placeholder="Выбрать на карте"
                  readOnly
                />
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Clinic */}
            <div>
              <input
                type="text"
                value={formData.clinic}
                onChange={(e) => setFormData({ ...formData, clinic: e.target.value })}
                className="w-full h-14 bg-white border-2 border-blue-200 rounded-2xl px-4 text-lg font-semibold focus:outline-none focus:border-blue-400"
                placeholder="Клиника"
              />
            </div>

            {/* Schedule */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">График работы</label>
              <div className="relative">
                <select
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  className="w-full h-14 bg-white border-2 border-blue-200 rounded-2xl px-4 text-lg font-semibold appearance-none cursor-pointer focus:outline-none focus:border-blue-400"
                >
                  {scheduleOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Work Hours */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Время работы</label>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 bg-white border-2 border-blue-200 rounded-2xl px-4 h-14">
                  <input
                    type="text"
                    value={formData.workStartHour}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                      const num = parseInt(val) || 0;
                      setFormData({ ...formData, workStartHour: num > 23 ? '23' : val });
                    }}
                    onBlur={(e) => {
                      const val = e.target.value;
                      if (val.length === 1) setFormData({ ...formData, workStartHour: '0' + val });
                      if (val === '') setFormData({ ...formData, workStartHour: '00' });
                    }}
                    className="w-12 bg-transparent text-center text-2xl font-black outline-none"
                  />
                  <div className="h-8 w-[2px] bg-gray-300"></div>
                  <input
                    type="text"
                    value={formData.workStartMinute}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                      const num = parseInt(val) || 0;
                      setFormData({ ...formData, workStartMinute: num > 59 ? '59' : val });
                    }}
                    onBlur={(e) => {
                      const val = e.target.value;
                      if (val.length === 1) setFormData({ ...formData, workStartMinute: '0' + val });
                      if (val === '') setFormData({ ...formData, workStartMinute: '00' });
                    }}
                    className="w-12 bg-transparent text-center text-2xl font-black outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 bg-white border-2 border-blue-200 rounded-2xl px-4 h-14">
                  <input
                    type="text"
                    value={formData.workEndHour}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                      const num = parseInt(val) || 0;
                      setFormData({ ...formData, workEndHour: num > 23 ? '23' : val });
                    }}
                    onBlur={(e) => {
                      const val = e.target.value;
                      if (val.length === 1) setFormData({ ...formData, workEndHour: '0' + val });
                      if (val === '') setFormData({ ...formData, workEndHour: '00' });
                    }}
                    className="w-12 bg-transparent text-center text-2xl font-black outline-none"
                  />
                  <div className="h-8 w-[2px] bg-gray-300"></div>
                  <input
                    type="text"
                    value={formData.workEndMinute}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                      const num = parseInt(val) || 0;
                      setFormData({ ...formData, workEndMinute: num > 59 ? '59' : val });
                    }}
                    onBlur={(e) => {
                      const val = e.target.value;
                      if (val.length === 1) setFormData({ ...formData, workEndMinute: '0' + val });
                      if (val === '') setFormData({ ...formData, workEndMinute: '00' });
                    }}
                    className="w-12 bg-transparent text-center text-2xl font-black outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-48 h-48 rounded-3xl overflow-hidden bg-gray-200">
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                className="hidden"
                accept="image/*"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 font-semibold text-lg hover:underline"
              >
                Изменить фото
              </button>
              <button className="text-blue-600 font-semibold text-lg hover:underline">
                Добавить аватарку
              </button>
            </div>

            {/* Telegram */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Telegram</label>
              <input
                type="text"
                value={formData.telegram}
                onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                className="w-full h-14 bg-white border-2 border-blue-200 rounded-2xl px-4 text-lg font-semibold focus:outline-none focus:border-blue-400"
                placeholder="@stomatolog"
              />
            </div>

            {/* Instagram */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Instagram</label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full h-14 bg-white border-2 border-blue-200 rounded-2xl px-4 text-lg font-semibold focus:outline-none focus:border-blue-400"
                placeholder="stomatolog.uz"
              />
            </div>

            {/* Instagram (duplicate in screenshot) */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Instagram</label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full h-14 bg-white border-2 border-blue-200 rounded-2xl px-4 text-lg font-semibold focus:outline-none focus:border-blue-400"
                placeholder="stomatolog.uz"
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Whatsapp</label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, '');
                  if (val.startsWith('998')) {
                    val = val.slice(0, 12);
                  } else {
                    val = val.slice(0, 9);
                  }
                  setFormData({ ...formData, whatsapp: val });
                }}
                onBlur={(e) => {
                  let val = e.target.value.replace(/\D/g, '');
                  if (val && !val.startsWith('998')) {
                    val = '998' + val;
                  }
                  if (val.length === 12) {
                    const formatted = `+${val.slice(0, 3)} ${val.slice(3, 5)} ${val.slice(5, 8)} ${val.slice(8, 10)} ${val.slice(10, 12)}`;
                    setFormData({ ...formData, whatsapp: formatted });
                  }
                }}
                className="w-full h-14 bg-white border-2 border-blue-200 rounded-2xl px-4 text-lg font-semibold focus:outline-none focus:border-blue-400"
                placeholder="+998 90 123 45 67"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={updateProfile.isPending}
            className="px-12 py-4 bg-blue-600 text-white text-lg font-bold rounded-2xl hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {updateProfile.isPending ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>

      {/* Map Modal */}
      {isMapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold">Выберите адрес на карте</h2>
              <button
                onClick={() => setIsMapModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Map Container */}
            <div className="relative h-[350px] bg-gray-100">
              <iframe
                src={`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}&z=15&output=embed`}
                className="w-full h-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <MapPin className="w-10 h-10 text-red-600 drop-shadow-lg" fill="currentColor" />
              </div>
            </div>

            {/* Address Input */}
            <div className="p-4 border-t">
              <label className="block text-sm text-gray-600 mb-2">Адрес</label>
              <input
                type="text"
                value={mapAddress}
                onChange={(e) => setMapAddress(e.target.value)}
                className="w-full h-12 bg-gray-50 border-2 border-gray-200 rounded-2xl px-4 text-base font-semibold focus:outline-none focus:border-blue-400"
                placeholder="Введите адрес"
              />
              <p className="text-xs text-gray-500 mt-2">
                Координаты: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-4 border-t">
              <button
                onClick={() => setIsMapModalOpen(false)}
                className="flex-1 px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleMapConfirm}
                className="flex-1 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors"
              >
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-green-500 text-white px-6 py-4 rounded-2xl shadow-lg flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-semibold text-lg">Профиль успешно обновлён!</span>
          </div>
        </div>
      )}
    </div>
  );
}
