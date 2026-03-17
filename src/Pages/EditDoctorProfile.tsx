import { useState, useRef, useEffect } from 'react';
import { FileText, ArrowLeft, MapPin, ChevronDown, X, Upload, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDentistProfile, useUpdateDentistProfile, useUploadDiploma } from '../api/profile';
import { useTranslation } from 'react-i18next';
import DentistImg from '../assets/img/photos/Dentist.png';
import { useQueryClient } from '@tanstack/react-query';

export default function EditDoctorProfile() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: dentist } = useDentistProfile();
  const updateProfile = useUpdateDentistProfile();
  const uploadDiploma = useUploadDiploma();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const diplomaInputRef = useRef<HTMLInputElement>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [mapAddress, setMapAddress] = useState('');
  const [coordinates] = useState({ lat: 41.2995, lng: 69.2401 }); // Tashkent default
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  const [formData, setFormData] = useState({
    specialization: '',
    phone: '',
    address: '',
    clinic: '',
    age: '',
    experience_years: '',
    schedule: 'every_day',
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
        specialization: dentist.specialization || 'surgeon',
        phone: dentist.phone?.startsWith('+998') ? dentist.phone : '+998 ' + (dentist.phone || ''),
        address: dentist.address || '',
        clinic: dentist.clinic || '',
        age: dentist.age?.toString() || '',
        experience_years: dentist.experience_years?.toString() || '',
        schedule: dentist.schedule || 'every_day',
        workStartHour: startHour,
        workStartMinute: startMinute,
        workEndHour: endHour,
        workEndMinute: endMinute,
        telegram: dentist.telegram || '',
        instagram: dentist.instagram || '',
        whatsapp: dentist.whatsapp?.startsWith('+998') ? dentist.whatsapp : '+998 ' + (dentist.whatsapp || ''),
      });
    }
  }, [dentist]);

  const [avatar, setAvatar] = useState<string>(DentistImg);

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    const fields = [
      formData.specialization,
      formData.phone,
      formData.address,
      formData.clinic,
      formData.age,
      formData.experience_years,
      formData.telegram || formData.instagram || formData.whatsapp, // At least one social
    ];

    const filledFields = fields.filter(field => field && field !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const completionPercentage = calculateCompletion();

  const specializations = [
    { key: 'general', label: t('common.specializations.general') },
    { key: 'surgeon', label: t('common.specializations.surgeon') },
    { key: 'therapist', label: t('common.specializations.therapist') },
    { key: 'orthodontist', label: t('common.specializations.orthodontist') },
    { key: 'orthopedist', label: t('common.specializations.orthopedist') },
    { key: 'periodontist', label: t('common.specializations.periodontist') },
    { key: 'implantologist', label: t('common.specializations.implantologist') },
    { key: 'hygienist', label: t('common.specializations.hygienist') },
    { key: 'aesthetician', label: t('common.specializations.aesthetician') },
    { key: 'pediatric', label: t('common.specializations.pediatric') }
  ];

  const scheduleOptions = [
    { key: 'every_day', label: t('common.schedule_options.every_day') },
    { key: 'weekdays', label: t('common.schedule_options.weekdays') },
    { key: 'weekends', label: t('common.schedule_options.weekends') },
    { key: 'mon_fri', label: t('common.schedule_options.mon_fri') },
    { key: 'custom', label: t('common.schedule_options.custom') }
  ];

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
    }
  };

  const handleDiplomaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await uploadDiploma.mutateAsync(file);
        setShowSuccessNotification(true);
        setTimeout(() => setShowSuccessNotification(false), 3000);
      } catch (error) {
        console.error('Failed to upload diploma:', error);
        alert(t('common.error'));
      }
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
        age: formData.age ? parseInt(formData.age) : undefined,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : undefined,
        schedule: formData.schedule,
        work_hours: `${formData.workStartHour}:${formData.workStartMinute}-${formData.workEndHour}:${formData.workEndMinute}`,
        telegram: formData.telegram,
        instagram: formData.instagram,
        whatsapp: formData.whatsapp,
      });

      // Инвалидируем все связанные квери для мгновенного обновления во всем приложении
      await queryClient.invalidateQueries({ queryKey: ['dentistProfile'] });
      await queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      await queryClient.invalidateQueries({ queryKey: ['dentistStats'] });

      // Показываем уведомление
      setShowSuccessNotification(true);
      setTimeout(() => {
        setShowSuccessNotification(false);
        navigate('/profile');
      }, 2000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert(t('common.error'));
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
          <h1 className="text-3xl font-bold">{t('doctor_profile.edit')}</h1>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold text-gray-700">Заполнение профиля</span>
            <span className="text-2xl font-bold text-blue-600">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionPercentage}%` }}
            >
              {completionPercentage > 0 && (
                <div className="h-full w-full bg-white/20 animate-pulse"></div>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {completionPercentage === 100
              ? '✓ Профиль заполнен полностью!'
              : `Заполните все поля для завершения профиля`}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Specialization */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">{t('doctor_profile.services')}</label>
              <div className="relative">
                <select
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full h-14 bg-white border-2 border-blue-200 rounded-2xl px-4 text-lg font-semibold appearance-none cursor-pointer focus:outline-none focus:border-blue-400"
                >
                  {specializations.map((spec) => (
                    <option key={spec.key} value={spec.key}>{spec.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">{t('doctor_profile.phone_number')}</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  let val = e.target.value;
                  if (!val.startsWith('+998 ')) {
                    val = '+998 ' + val.replace(/^\+?998\s?/, '');
                  }
                  setFormData({ ...formData, phone: val });
                }}
                className="w-full h-14 bg-white border-2 border-blue-200 rounded-2xl px-4 text-lg font-semibold focus:outline-none focus:border-blue-400"
                placeholder="+998 93 123 45 67"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">{t('doctor_profile.address')}</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  onClick={handleMapClick}
                  className="w-full h-14 bg-white border-2 border-blue-200 rounded-2xl px-4 pr-12 text-lg font-semibold focus:outline-none focus:border-blue-400 cursor-pointer"
                  placeholder={t('common.map.select_on_map')}
                  readOnly
                />
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Clinic */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">{t('doctor_profile.clinic')}</label>
              <input
                type="text"
                value={formData.clinic}
                onChange={(e) => setFormData({ ...formData, clinic: e.target.value })}
                className="w-full h-14 bg-white border-2 border-blue-200 rounded-2xl px-4 text-lg font-semibold focus:outline-none focus:border-blue-400"
                placeholder={t('doctor_profile.clinic')}
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Возраст</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full h-14 bg-white border-2 border-blue-200 rounded-2xl px-4 text-lg font-semibold focus:outline-none focus:border-blue-400"
                placeholder="Например: 35"
                min="18"
                max="100"
              />
            </div>

            {/* Experience Years */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Стаж работы (лет)</label>
              <input
                type="number"
                value={formData.experience_years}
                onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                className="w-full h-14 bg-white border-2 border-blue-200 rounded-2xl px-4 text-lg font-semibold focus:outline-none focus:border-blue-400"
                placeholder="Например: 10"
                min="0"
                max="80"
              />
            </div>

            {/* Schedule */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">{t('doctor_profile.schedule')}</label>
              <div className="relative">
                <select
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  className="w-full h-14 bg-white border-2 border-blue-200 rounded-2xl px-4 text-lg font-semibold appearance-none cursor-pointer focus:outline-none focus:border-blue-400"
                >
                  {scheduleOptions.map((option) => (
                    <option key={option.key} value={option.key}>{option.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Work Hours */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">{t('doctor_profile.work_hours')}</label>
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
                {t('doctor_profile.edit')} {t('common.photo').toLowerCase()}
              </button>
              <button className="text-blue-600 font-semibold text-lg hover:underline">
                {t('doctor_profile.add_avatar')}
              </button>
            </div>

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

            {/* WhatsApp */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Whatsapp</label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => {
                  let val = e.target.value;
                  if (!val.startsWith('+998 ')) {
                    val = '+998 ' + val.replace(/^\+?998\s?/, '');
                  }
                  setFormData({ ...formData, whatsapp: val });
                }}
                className="w-full h-14 bg-white border-2 border-blue-200 rounded-2xl px-4 text-lg font-semibold focus:outline-none focus:border-blue-400"
                placeholder="+998 90 123 45 67"
              />
            </div>

            {/* Diploma Section */}
            <div className="p-6 bg-white rounded-3xl shadow-sm border-2 border-blue-50">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold">Диплом и сертификаты</h3>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Загрузите ваш диплом для подтверждения квалификации. Проверка занимает до 6 часов.
                </p>

                {dentist?.diploma_photo_url && (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-gray-100 bg-gray-50 flex items-center justify-center">
                    <img
                      src={dentist.diploma_photo_url.startsWith('/') ? `${import.meta.env.VITE_API_URL}${dentist.diploma_photo_url}` : dentist.diploma_photo_url}
                      alt="Diploma"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <div className="flex items-center gap-3">
                    {dentist?.verification_status === 'approved' ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : dentist?.verification_status === 'rejected' ? (
                      <AlertCircle className="w-6 h-6 text-red-500" />
                    ) : (
                      <Clock className="w-6 h-6 text-yellow-500" />
                    )}
                    <div>
                      <p className="font-bold text-gray-800">
                        {dentist?.verification_status === 'approved' ? 'Подтверждено' :
                          dentist?.verification_status === 'rejected' ? 'Не подтверждено' : 'На проверке'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {dentist?.verification_status === 'approved' ? 'Ваш профиль верифицирован' :
                          dentist?.verification_status === 'rejected' ? 'Загрузите документ повторно' : 'Ожидайте завершения проверки'}
                      </p>
                    </div>
                  </div>

                  <input
                    type="file"
                    ref={diplomaInputRef}
                    onChange={handleDiplomaUpload}
                    className="hidden"
                    accept="image/*,.pdf"
                  />

                  <button
                    onClick={() => diplomaInputRef.current?.click()}
                    disabled={uploadDiploma.isPending}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    {uploadDiploma.isPending ? 'Загрузка...' : 'Загрузить'}
                  </button>
                </div>
              </div>
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
            {updateProfile.isPending ? t('common.loading') : t('doctor_profile.save')}
          </button>
        </div>
      </div>

      {/* Map Modal */}
      {isMapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold">{t('common.map.select_on_map')}</h2>
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
              <label className="block text-sm text-gray-600 mb-2">{t('doctor_profile.address')}</label>
              <input
                type="text"
                value={mapAddress}
                onChange={(e) => setMapAddress(e.target.value)}
                className="w-full h-12 bg-gray-50 border-2 border-gray-200 rounded-2xl px-4 text-base font-semibold focus:outline-none focus:border-blue-400"
                placeholder={t('common.map.enter_address')}
              />
              <p className="text-xs text-gray-500 mt-2">
                {t('common.map.coordinates')}: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-4 border-t">
              <button
                onClick={() => setIsMapModalOpen(false)}
                className="flex-1 px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
              >
                {t('common.modal.cancel')}
              </button>
              <button
                onClick={handleMapConfirm}
                className="flex-1 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors"
              >
                {t('common.map.confirm')}
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
            <span className="font-semibold text-lg">{t('common.appointments.details.success_update')}</span>
          </div>
        </div>
      )}
    </div>
  );
}
