import React from 'react';
import PageHeader from '../components/DoctorProfile/PageHeader';
import DoctorInfoCard from '../components/DoctorProfile/DoctorInfoCard';
import ContactInfoCard from '../components/DoctorProfile/ContactInfoCard';
import StatsSection from '../components/DoctorProfile/StatsSection';
import ServicesSection from '../components/DoctorProfile/ServicesSection';
import WorksSection from '../components/DoctorProfile/WorksSection';
import ScheduleCard from '../components/DoctorProfile/ScheduleCard';
import SocialNetworksCard from '../components/DoctorProfile/SocialNetworksCard';

const DoctorProfile: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F3F6FB]">
      <div className="max-w-[1440px] mx-auto px-6 py-6">

        {/* PAGE HEADER */}
        <PageHeader />

        <div className="mt-6 space-y-6">
          
          {/* Doctor info + Contacts */}
          <div className="grid grid-cols-1  lg:grid-cols-12">
            <div className="lg:col-span-5">
              <DoctorInfoCard />
            </div>
            <div className="lg:col-span-7">
              <ContactInfoCard />
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
            <ScheduleCard />
            <SocialNetworksCard />
          </div>

        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
