import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, MapPin, ChevronDown, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDentistProfile, useUpdateDentistProfile, useUploadDiploma } from '../api/profile';
import { toast } from '../components/Shared/Toast';
import DentistImg from '../assets/img/photos/Dentist.png';
import { MapContainer, TileLayer, CircleMarker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function MapPicker({
  lat,
  lng,
  onPick,
}: {
  lat: number;
  lng: number;
  onPick: (nextLat: number, nextLng: number) => void;
}) {
  useMapEvents({
    click(event: any) {
      onPick(event.latlng.lat, event.latlng.lng);
    },
  });

  return (
    // @ts-ignore
    <CircleMarker
      center={[lat, lng]}
      radius={10}
      pathOptions={{ color: '#dc2626', fillColor: '#ef4444', fillOpacity: 0.9 }}
    />
  );
}

export default function EditDoctorProfile() {
  const navigate = useNavigate();
  const { data: dentist, refetch } = useDentistProfile();
  const updateProfile = useUpdateDentistProfile();
  const uploadDiploma = useUploadDiploma();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const diplomaInputRef = useRef<HTMLInputElement>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [mapAddress, setMapAddress] = useState('');
  const [mapLoading, setMapLoading] = useState(false);
  const [mapError, setMapError] = useState('');
  const [hasPickedLocation, setHasPickedLocation] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: 41.2995, lng: 69.2401 });
  const [avatar, setAvatar] = useState<string>(DentistImg);

  const [formData, setFormData] = useState({
    specialization: '',
    phone: '',
    address: '',
    clinic: '',
    birthDate: '',
    experienceYears: '',
    schedule: 'Каждый день',
    workStartHour: '08',
    workStartMinute: '00',
    workEndHour: '16',
    workEndMinute: '00',
    telegram: '',
    instagram: '',
    whatsapp: '',
    gender: '',
  });

  useEffect(() => {
    if (!dentist) return;

    const workHours = dentist.work_hours?.split('-') || ['08:00', '16:00'];
    const [startHour, startMinute] = workHours[0]?.split(':') || ['08', '00'];
    const [endHour, endMinute] = workHours[1]?.split(':') || ['16', '00'];

    setFormData({
      specialization: dentist.specialization || '',
      phone: dentist.phone || '',
      address: dentist.address || '',
      clinic: dentist.clinic || '',
      birthDate: dentist.birth_date ? dentist.birth_date.slice(0, 10) : '',
      experienceYears: dentist.experience_years != null ? String(dentist.experience_years) : '',
      schedule: dentist.schedule || 'Каждый день',
      workStartHour: startHour,
      workStartMinute: startMinute,
      workEndHour: endHour,
      workEndMinute: endMinute,
      telegram: dentist.telegram || '',
      instagram: dentist.instagram || '',
      whatsapp: dentist.whatsapp || '',
      gender: dentist.gender || '',
    });

    if (dentist.latitude && dentist.longitude) {
      setCoordinates({ lat: dentist.latitude, lng: dentist.longitude });
      setHasPickedLocation(true);
    }
  }, [dentist]);

  const specializations = ['Хирург', 'Терапевт', 'Ортодонт', 'Ортопед', 'Пародонтолог', 'Имплантолог', 'Общая стоматология'];
  const scheduleOptions = ['Каждый день', 'Будние дни', 'Выходные', 'Понедельник - Пятница', 'Индивидуальный график'];

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatar(URL.createObjectURL(file));
  };

  const handleDiplomaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    toast.success('Загрузка диплома...');
    try {
      await uploadDiploma.mutateAsync(file);
      await refetch();
      toast.success('Диплом успешно загружен и отправлен на проверку!');
    } catch (error) {
      console.error('Failed to upload diploma:', error);
      toast.error('Ошибка при загрузке диплома');
    }
  };

  const pickLocation = async (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
    setHasPickedLocation(true);
    setMapError('');

    try {
      const reverse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await reverse.json();
      if (data?.display_name) {
        setMapAddress(data.display_name);
      }
    } catch {
      // Ignore reverse geocoding failures.
    }
  };

  const handleSearchAddress = async () => {
    const query = mapAddress.trim();
    if (!query) {
      setMapError('Сначала введите адрес');
      return;
    }

    setMapLoading(true);
    setMapError('');
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        setMapError('Адрес не найден. Уточните адрес и попробуйте снова.');
        return;
      }

      setCoordinates({
        lat: Number(data[0].lat),
        lng: Number(data[0].lon),
      });
      setHasPickedLocation(true);
      setMapAddress(data[0].display_name || query);
    } catch {
      setMapError('Не удалось найти адрес. Проверьте интернет и попробуйте снова.');
    } finally {
      setMapLoading(false);
    }
  };

  const handleMapConfirm = async () => {
    let finalAddress = mapAddress.trim();
    if (!finalAddress) {
      try {
        const reverse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates.lat}&lon=${coordinates.lng}`
        );
        const data = await reverse.json();
        finalAddress = data?.display_name || '';
      } catch {
        finalAddress = '';
      }
    }

    if (!finalAddress) {
      setMapError('Сначала найдите адрес через кнопку "Найти".');
      return;
    }

    setMapAddress(finalAddress);
    setFormData((prev) => ({ ...prev, address: finalAddress }));
    setHasPickedLocation(true);
    setIsMapModalOpen(false);
  };

  const handleSave = async () => {
    try {
      const payload: any = {
        specialization: formData.specialization,
        phone: formData.phone,
        address: formData.address,
        clinic: formData.clinic,
        birth_date: formData.birthDate || null,
        experience_years: formData.experienceYears ? parseInt(formData.experienceYears, 10) : null,
        schedule: formData.schedule,
        work_hours: `${formData.workStartHour}:${formData.workStartMinute}-${formData.workEndHour}:${formData.workEndMinute}`,
        telegram: formData.telegram,
        instagram: formData.instagram,
        whatsapp: formData.whatsapp,
        gender: formData.gender || null,
      };

      if (hasPickedLocation) {
        payload.latitude = coordinates.lat;
        payload.longitude = coordinates.lng;
      }

      await updateProfile.mutateAsync(payload);
      await refetch();
      toast.success('Профиль успешно обновлён!');
      setTimeout(() => navigate('/profile'), 1200);
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Ошибка при сохранении профиля');
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F6FB] p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate('/profile')}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-3xl font-bold">Редактирование</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm text-gray-600">Специализация</label>
              <div className="relative">
                <select
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="h-14 w-full appearance-none rounded-2xl border-2 border-blue-200 bg-white px-4 text-lg font-semibold focus:border-blue-400 focus:outline-none"
                >
                  <option value="">Не выбрано</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm text-gray-600">Дата рождения</label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="h-14 w-full rounded-2xl border-2 border-blue-200 bg-white px-4 text-lg font-semibold focus:border-blue-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-gray-600">Стаж</label>
                <input
                  type="number"
                  min="0"
                  max="80"
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                  className="h-14 w-full rounded-2xl border-2 border-blue-200 bg-white px-4 text-lg font-semibold focus:border-blue-400 focus:outline-none"
                  placeholder="5"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-gray-600">Пол</label>
                <div className="relative">
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="h-14 w-full appearance-none rounded-2xl border-2 border-blue-200 bg-white px-4 text-lg font-semibold focus:border-blue-400 focus:outline-none"
                  >
                    <option value="">Не выбрано</option>
                    <option value="male">Мужской</option>
                    <option value="female">Женский</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-600">Телефонный номер</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="h-14 w-full rounded-2xl border-2 border-blue-200 bg-white px-4 text-lg font-semibold focus:border-blue-400 focus:outline-none"
                placeholder="+998 93 123 45 67"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-600">Адрес</label>
              <div className="group relative">
                <input
                  type="text"
                  value={formData.address}
                  onClick={() => {
                    setMapAddress(formData.address);
                    setMapError('');
                    setIsMapModalOpen(true);
                  }}
                  className="h-14 w-full cursor-pointer rounded-2xl border-2 border-blue-200 bg-white px-4 pr-28 text-lg font-semibold transition-colors group-hover:border-blue-300 focus:border-blue-400 focus:outline-none"
                  placeholder="Выбрать на карте"
                  readOnly
                />
                <span className="absolute right-11 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-600">Открыть карту</span>
                <MapPin className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-600">Клиника</label>
              <input
                type="text"
                value={formData.clinic}
                onChange={(e) => setFormData({ ...formData, clinic: e.target.value })}
                className="h-14 w-full rounded-2xl border-2 border-blue-200 bg-white px-4 text-lg font-semibold focus:border-blue-400 focus:outline-none"
                placeholder="Клиника"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-600">График работы</label>
              <div className="relative">
                <select
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  className="h-14 w-full appearance-none rounded-2xl border-2 border-blue-200 bg-white px-4 text-lg font-semibold focus:border-blue-400 focus:outline-none"
                >
                  {scheduleOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-600">Время работы</label>
              <div className="flex gap-4">
                <div className="flex h-14 items-center gap-2 rounded-2xl border-2 border-blue-200 bg-white px-4">
                  <input
                    type="text"
                    value={formData.workStartHour}
                    onChange={(e) => setFormData({ ...formData, workStartHour: e.target.value.replace(/\D/g, '').slice(0, 2) })}
                    className="w-12 bg-transparent text-center text-2xl font-black outline-none"
                  />
                  <div className="h-8 w-[2px] bg-gray-300" />
                  <input
                    type="text"
                    value={formData.workStartMinute}
                    onChange={(e) => setFormData({ ...formData, workStartMinute: e.target.value.replace(/\D/g, '').slice(0, 2) })}
                    className="w-12 bg-transparent text-center text-2xl font-black outline-none"
                  />
                </div>
                <div className="flex h-14 items-center gap-2 rounded-2xl border-2 border-blue-200 bg-white px-4">
                  <input
                    type="text"
                    value={formData.workEndHour}
                    onChange={(e) => setFormData({ ...formData, workEndHour: e.target.value.replace(/\D/g, '').slice(0, 2) })}
                    className="w-12 bg-transparent text-center text-2xl font-black outline-none"
                  />
                  <div className="h-8 w-[2px] bg-gray-300" />
                  <input
                    type="text"
                    value={formData.workEndMinute}
                    onChange={(e) => setFormData({ ...formData, workEndMinute: e.target.value.replace(/\D/g, '').slice(0, 2) })}
                    className="w-12 bg-transparent text-center text-2xl font-black outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="h-48 w-48 overflow-hidden rounded-3xl bg-gray-200">
                <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
              </div>
              <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
              <button onClick={() => fileInputRef.current?.click()} className="text-lg font-semibold text-blue-600 hover:underline">
                Изменить фото
              </button>
            </div>

            <div className="rounded-3xl border-2 border-blue-200 bg-white p-6">
              <h3 className="mb-4 text-xl font-bold">Ваш диплом</h3>
              {dentist?.diploma_photo_url ? (
                <div className="mb-4">
                  <div className="mb-3 h-48 w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                    <img src={`http://localhost:8000${dentist.diploma_photo_url}`} alt="Diploma" className="h-full w-full object-cover" />
                  </div>
                </div>
              ) : (
                <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-500">
                  Диплом еще не загружен
                </div>
              )}

              <input type="file" ref={diplomaInputRef} onChange={handleDiplomaChange} className="hidden" accept="image/*,application/pdf" />
              <button
                onClick={() => diplomaInputRef.current?.click()}
                disabled={uploadDiploma.isPending}
                className="w-full rounded-xl bg-blue-50 py-3 font-bold text-blue-600 transition-colors hover:bg-blue-100 disabled:opacity-50"
              >
                {uploadDiploma.isPending ? 'Загрузка...' : dentist?.diploma_photo_url ? 'Загрузить новый диплом' : 'Добавить копию диплома'}
              </button>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-600">Telegram</label>
              <input
                type="text"
                value={formData.telegram}
                onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                className="h-14 w-full rounded-2xl border-2 border-blue-200 bg-white px-4 text-lg font-semibold focus:border-blue-400 focus:outline-none"
                placeholder="@stomatolog"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-600">Instagram</label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="h-14 w-full rounded-2xl border-2 border-blue-200 bg-white px-4 text-lg font-semibold focus:border-blue-400 focus:outline-none"
                placeholder="stomatolog.uz"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-600">Whatsapp</label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="h-14 w-full rounded-2xl border-2 border-blue-200 bg-white px-4 text-lg font-semibold focus:border-blue-400 focus:outline-none"
                placeholder="+998 90 123 45 67"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={updateProfile.isPending}
            className="rounded-2xl bg-blue-600 px-12 py-4 text-lg font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {updateProfile.isPending ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>

      {isMapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-xl font-bold">Выберите адрес на карте</h2>
              <button onClick={() => setIsMapModalOpen(false)} className="rounded-full p-2 transition-colors hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative h-[350px] bg-gray-100">
              {/* @ts-ignore */}
              <MapContainer center={[coordinates.lat, coordinates.lng]} zoom={14} scrollWheelZoom className="h-full w-full">
                {/* @ts-ignore */}
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapPicker lat={coordinates.lat} lng={coordinates.lng} onPick={pickLocation} />
              </MapContainer>
            </div>

            <div className="border-t p-4">
              <label className="mb-2 block text-sm text-gray-600">Адрес</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={mapAddress}
                  onChange={(e) => setMapAddress(e.target.value)}
                  className="h-12 w-full rounded-2xl border-2 border-gray-200 bg-gray-50 px-4 text-base font-semibold focus:border-blue-400 focus:outline-none"
                  placeholder="Введите адрес"
                />
                <button
                  onClick={handleSearchAddress}
                  disabled={mapLoading}
                  className="h-12 rounded-2xl bg-blue-600 px-4 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
                >
                  {mapLoading ? 'Поиск...' : 'Найти'}
                </button>
              </div>
              {mapError ? <p className="mt-2 text-xs text-red-500">{mapError}</p> : null}
              <p className="mt-2 text-xs text-gray-500">Координаты: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}</p>
            </div>

            <div className="flex gap-3 border-t p-4">
              <button
                onClick={() => setIsMapModalOpen(false)}
                className="flex-1 rounded-2xl bg-gray-100 px-6 py-2.5 font-bold text-gray-700 transition-colors hover:bg-gray-200"
              >
                Отмена
              </button>
              <button
                onClick={handleMapConfirm}
                className="flex-1 rounded-2xl bg-blue-600 px-6 py-2.5 font-bold text-white transition-colors hover:bg-blue-700"
              >
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
