import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, MapPin, ChevronDown, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDentistProfile, useUpdateDentistProfile } from '../api/profile';
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
    click(event) {
      onPick(event.latlng.lat, event.latlng.lng);
    },
  });

  return (
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [mapAddress, setMapAddress] = useState('');
  const [mapLoading, setMapLoading] = useState(false);
  const [mapError, setMapError] = useState('');
  const [hasPickedLocation, setHasPickedLocation] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: 41.2995, lng: 69.2401 }); // Tashkent default

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
      if (dentist.latitude && dentist.longitude) {
        setCoordinates({ lat: dentist.latitude, lng: dentist.longitude });
        setHasPickedLocation(true);
      }
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
    setMapError('');
    setIsMapModalOpen(true);
  };

  const pickLocation = async (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
    setHasPickedLocation(true);
    setMapError('');

    try {
      const reverse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await reverse.json();
      if (data?.display_name) {
        setMapAddress(data.display_name);
      }
    } catch {
      // Keep manual input as fallback if reverse-geocoding fails.
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
      if (data[0].display_name) {
        setMapAddress(data[0].display_name);
      }
      if (!formData.address && data[0].display_name) {
        setMapAddress(data[0].display_name);
      }
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
    setHasPickedLocation(true);
    setFormData({
      ...formData,
      address: finalAddress,
    });
    setIsMapModalOpen(false);
  };

  const handleSave = async () => {
    try {
      const payload: any = {
        specialization: formData.specialization,
        phone: formData.phone,
        address: formData.address,
        clinic: formData.clinic,
        schedule: formData.schedule,
        work_hours: `${formData.workStartHour}:${formData.workStartMinute}-${formData.workEndHour}:${formData.workEndMinute}`,
        telegram: formData.telegram,
        instagram: formData.instagram,
        whatsapp: formData.whatsapp,
      };
      if (hasPickedLocation) {
        payload.latitude = coordinates.lat;
        payload.longitude = coordinates.lng;
      }
      await updateProfile.mutateAsync(payload);
      
      // Обновляем данные профиля
      await refetch();
      
      // Показываем уведомление
      toast.success('Профиль успешно обновлён!');
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Ошибка при сохранении профиля');
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
              <div className="relative group">
                <input
                  type="text"
                  value={formData.address}
                  onClick={handleMapClick}
                  className="w-full h-14 bg-white border-2 border-blue-200 rounded-2xl px-4 pr-28 text-lg font-semibold focus:outline-none focus:border-blue-400 cursor-pointer group-hover:border-blue-300 transition-colors"
                  placeholder="Выбрать на карте"
                  readOnly
                />
                <span className="absolute right-11 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-600">
                  Открыть карту
                </span>
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
              <MapContainer
                center={[coordinates.lat, coordinates.lng]}
                zoom={14}
                scrollWheelZoom
                className="w-full h-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapPicker
                  lat={coordinates.lat}
                  lng={coordinates.lng}
                  onPick={pickLocation}
                />
              </MapContainer>
              <div className="absolute left-3 top-3 bg-white/90 rounded-xl px-3 py-1 text-xs text-gray-700 shadow">
                Нажмите на карту, чтобы выбрать точку
              </div>
            </div>

            {/* Address Input */}
            <div className="p-4 border-t">
              <label className="block text-sm text-gray-600 mb-2">Адрес</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={mapAddress}
                  onChange={(e) => setMapAddress(e.target.value)}
                  className="w-full h-12 bg-gray-50 border-2 border-gray-200 rounded-2xl px-4 text-base font-semibold focus:outline-none focus:border-blue-400"
                  placeholder="Введите адрес"
                />
                <button
                  onClick={handleSearchAddress}
                  disabled={mapLoading}
                  className="px-4 h-12 bg-blue-600 text-white text-sm font-bold rounded-2xl hover:bg-blue-700 disabled:opacity-60 transition-colors"
                >
                  {mapLoading ? 'Поиск...' : 'Найти'}
                </button>
              </div>
              {mapError ? (
                <p className="text-xs text-red-500 mt-2">{mapError}</p>
              ) : null}
              <p className="text-xs text-gray-500 mt-2">
                Координаты: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
              </p>
              <button
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`, '_blank')}
                className="text-xs text-blue-600 mt-1 hover:underline"
              >
                Открыть эту точку в Google Maps
              </button>
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

      {/* Profile edit ends */}
    </div>
  );
}
