import Doshboard from "../Layouts/Doshboard";
import MobileHeaderAndDrawer from "../Layouts/MobileHeaderAndDrawer";
import AnalyticsHeader from '../components/Analytics/AnalyticsHeader';
import StatCard from '../components/Analytics/StatCard';
import AppointmentsChart from '../components/Analytics/AppointmentsChart';
import GenderChart from '../components/Analytics/GenderChart';
import AgeDistribution from '../components/Analytics/AgeDistribution';
import ClientStatusCharts from '../components/Analytics/ClientStatusCharts';
import { useTranslation } from 'react-i18next';

const Analitic = () => {
    const { t } = useTranslation();

    return (
        <div className='flex min-h-screen bg-[#f5f7fb]'>
            <main className='flex-1 p-8 overflow-y-auto max-h-screen'>
                <div className="max-w-[1600px] mx-auto">
                    <AnalyticsHeader />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <StatCard
                            title={t('analytics.stats.total_appointments')}
                            value="1,2"
                            unit={t('analytics.stats.thousand')}
                            trend={{ value: '45', label: t('analytics.stats.last_month'), isPositive: true }}
                        />
                        <StatCard
                            title={t('analytics.stats.completed_appointments')}
                            value="950"
                            trend={{ value: '20', label: t('analytics.stats.last_week'), isPositive: true }}
                        />
                        <StatCard
                            title={t('analytics.stats.reviews')}
                            value="68"
                            actionButton={{ label: t('analytics.stats.reviews'), onClick: () => console.log('View reviews') }}
                        />
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                        <div className="xl:col-span-2">
                            <AppointmentsChart />
                        </div>
                        <div className="">
                            <GenderChart />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        <div className="xl:col-span-2">
                            <AgeDistribution />
                        </div>
                        <div>
                            <ClientStatusCharts />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Analitic;