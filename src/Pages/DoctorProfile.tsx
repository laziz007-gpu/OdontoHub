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
  const [works, setWorks] = useState<string[]>([]);
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

  const handleAddWork = (url: string) => {
    setWorks(prev => [...prev, url]);
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
          <WorksSection works={works} onAddWork={handleAddWork} />

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
