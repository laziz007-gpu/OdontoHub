import { useState, useRef, useEffect, type FC } from 'react';
import { useTranslation } from 'react-i18next';
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
  age: string;
  experience_years: string;
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
  name: string;
}

const DoctorProfile: FC = () => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user.user);
  const { data: dentistData } = useDentistProfile();

  const [profileData, setProfileData] = useState<ProfileData>({
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    education: '',
    clinic: '',
    age: '',
    experience_years: '',
    specialization: 'surgeon',
    gender: 'Мужчина',
    name: user?.full_name || '',
    telegram: '',
    instagram: '',
    whatsapp: user?.phone || '',
    schedule: 'every_day',
    workStart: '08',
    startMinute: '00',
    workEnd: '16',
    endMinute: '00',
  });

  // Обновляем данные из API
  useEffect(() => {
    if (dentistData) {
      console.log('Dentist data from API:', dentistData); // Debug log
      
      const workHours = dentistData.work_hours?.split('-') || ['08:00', '16:00'];
      const [startHour, startMinute] = workHours[0]?.split(':') || ['08', '00'];
      const [endHour, endMinute] = workHours[1]?.split(':') || ['16', '00'];

      setProfileData(prev => ({
        ...prev,
        name: dentistData.full_name || prev.name,
        phone: dentistData.phone || prev.phone,
        specialization: dentistData.specialization || prev.specialization,
        address: dentistData.address || '',
        clinic: dentistData.clinic || '',
        age: dentistData.age ? `${dentistData.age}` : '',
        experience_years: dentistData.experience_years ? `${dentistData.experience_years}` : '',
        education: '', // Оставляем пустым, так как теперь используем отдельные поля
        schedule: dentistData.schedule || prev.schedule,
        telegram: dentistData.telegram || '',
        instagram: dentistData.instagram || '',
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
                specialization={t(`common.specializations.${profileData.specialization}`)}
                gender={profileData.gender}
                age={profileData.age}
                experience_years={profileData.experience_years}
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
              schedule={t(`common.schedule_options.${profileData.schedule}`)}
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
