import React from 'react';
import PageHeader from '../components/DoctorProfile/PageHeader';
import DoctorInfoCard from '../components/DoctorProfile/DoctorInfoCard';
import ContactInfoCard from '../components/DoctorProfile/ContactInfoCard';
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

const DoctorProfile: React.FC = () => {
  const [profileData, setProfileData] = React.useState<ProfileData>({
    phone: '+998 (93) 123 45 67',
    email: 'example@gmail.com',
    address: 'ул. Амира Темура, 11кв, 20дом',
    education: 'ТашПМИ (Факультет)',
    clinic: 'OdontoHub',
    specialization: 'Хирург',
    telegram: '@stom',
    instagram: 'stomatolog.uz',
    whatsapp: '+998 90 123 45 67',
    schedule: 'Каждый день',
    workStart: '08',
    startMinute: '00',
    workEnd: '16',
    endMinute: '00',
    gender: 'Мужчина',
    age: '25 лет',
    name: 'Пулатов Махмуд'
  });

  const handleUpdateProfile = (newData: Partial<ProfileData>) => {
    setProfileData(prev => ({ ...prev, ...newData }));
  };

  return (
    <div className="min-h-screen bg-[#F3F6FB]">
      <div className="max-w-[1440px] mx-auto px-6 py-6">

        {/* PAGE HEADER */}
        <PageHeader />

        <div className="mt-6 space-y-6">

          {/* Doctor info + Contacts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-12 xl:col-span-5">
              <DoctorInfoCard
                name={profileData.name}
                specialization={profileData.specialization}
                gender={profileData.gender}
                age={profileData.age}
              />
            </div>
            <div className="lg:col-span-12 xl:col-span-7">
              <ContactInfoCard
                data={profileData}
                onSave={handleUpdateProfile}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
