import { useState, useRef, useEffect, type FC } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import PageHeader from '../components/DoctorProfile/PageHeader';
import DoctorInfoCard from '../components/DoctorProfile/DoctorInfoCard';
import ContactInfoCard from '../components/DoctorProfile/ContactInfoCard';
import DentistImg from '../assets/img/photos/Dentist.png';
import StatsSection from '../components/DoctorProfile/StatsSection';
import ServicesSection from '../components/DoctorProfile/ServicesSection';
import WorksSection from '../components/DoctorProfile/WorksSection';
import ScheduleCard from '../components/DoctorProfile/ScheduleCard';
import SocialNetworksCard from '../components/DoctorProfile/SocialNetworksCard';
import { useDentistProfile } from '../api/profile';

interface ProfileData {
  phone: string;
  email: string;
  address: string;
  education: string;
  clinic: string;
  specialization: string;
  telegram: string;
  instagram: string;
  whatsapp: string;
  schedule: string;
  workStart: string;
  startMinute: string;
  workEnd: string;
  endMinute: string;
  gender: string;
  age: string;
  name: string;
}

const DoctorProfile: FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const { data: dentistData } = useDentistProfile();

  const [profileData, setProfileData] = useState<ProfileData>({
    phone: user?.phone || '+998 (93) 123 45 67',
    email: user?.email || 'example@gmail.com',
    address: 'ул. Амира Темура, 11кв, 20дом',
    education: 'ТашПМИ (Факультет)',
    clinic: 'OdontoHub',
    specialization: 'Хирург',
    telegram: '@stom',
    instagram: 'stomatolog.uz',
    whatsapp: user?.phone || '+998 90 123 45 67',
    schedule: 'Каждый день',
    workStart: '08',
    startMinute: '00',
    workEnd: '16',
    endMinute: '00',
    gender: 'Мужчина',
    age: '25 лет',
    name: user?.full_name || 'Пулатов Махмуд'
  });

  // Обновляем данные из API
  useEffect(() => {
    if (dentistData) {
      const workHours = dentistData.work_hours?.split('-') || ['08:00', '16:00'];
      const [startHour, startMinute] = workHours[0]?.split(':') || ['08', '00'];
      const [endHour, endMinute] = workHours[1]?.split(':') || ['16', '00'];

      setProfileData(prev => ({
        ...prev,
        name: dentistData.full_name || prev.name,
        phone: dentistData.phone || prev.phone,
        specialization: dentistData.specialization || prev.specialization,
        address: dentistData.address || prev.address,
        clinic: dentistData.clinic || prev.clinic,
        schedule: dentistData.schedule || prev.schedule,
        telegram: dentistData.telegram || prev.telegram,
        instagram: dentistData.instagram || prev.instagram,
        whatsapp: dentistData.whatsapp || prev.whatsapp,
        workStart: startHour,
        startMinute: startMinute,
        workEnd: endHour,
        endMinute: endMinute,
      }));
    }
  }, [dentistData]);

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.full_name || prev.name,
        phone: user.phone || prev.phone,
        email: user.email || prev.email,
        whatsapp: user.phone || prev.whatsapp
      }));
    }
  }, [user]);

  const [avatarUrl, setAvatarUrl] = useState<string>(DentistImg);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdateProfile = (newData: Partial<ProfileData>) => {
    setProfileData(prev => ({ ...prev, ...newData }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  const triggerAvatarUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-[#F3F6FB]">
      <div className="max-w-[1440px] mx-auto px-6 py-6">

        {/* PAGE HEADER */}
        <PageHeader />

        <div className="mt-8 space-y-8">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            className="hidden"
            accept="image/*"
          />

          {/* Doctor info + Contacts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-12 xl:col-span-4">
              <DoctorInfoCard
                name={profileData.name}
                specialization={profileData.specialization}
                gender={profileData.gender}
                age={profileData.age}
                avatar={avatarUrl}
                onAvatarClick={triggerAvatarUpload}
              />
            </div>
            <div className="lg:col-span-12 xl:col-span-8">
              <ContactInfoCard
                data={profileData}
                onSave={handleUpdateProfile}
                avatar={avatarUrl}
                triggerAvatarUpload={triggerAvatarUpload}
              />
            </div>
          </div>

          {/* Stats */}
          <StatsSection />

          {/* Services */}
          <ServicesSection />

          {/* Works */}
          <WorksSection />

          {/* Schedule + Socials */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
            <ScheduleCard
              workStart={profileData.workStart}
              startMinute={profileData.startMinute}
              workEnd={profileData.workEnd}
              endMinute={profileData.endMinute}
              onSave={handleUpdateProfile}
            />
            <SocialNetworksCard
              telegram={profileData.telegram}
              instagram={profileData.instagram}
              whatsapp={profileData.whatsapp}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
