import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePatientAppointments } from '../../api/appointments';
import { Loader2, Calendar, Clock, Activity } from 'lucide-react';

interface AppointmentsViewProps {
    patientId: number;
}

const AppointmentsView: React.FC<AppointmentsViewProps> = ({ patientId }) => {
    const { t } = useTranslation();
    const { data: appointments, isLoading } = usePatientAppointments(patientId);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#5377f7] mb-4" />
                <p className="text-gray-500 font-medium">{t('common.loading')}</p>
            </div>
        );
    }

    if (!appointments || appointments.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-[#1e2235] mb-2">{t('patient_profile.no_appointments_title') || 'Записей пока нет'}</h3>
                <p className="text-gray-500">{t('patient_profile.no_appointments_desc') || 'У этого пациента еще нет запланированных визитов.'}</p>
            </div>
        );
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString();
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'confirmed': return 'bg-green-100 text-green-700';
            case 'completed': return 'bg-blue-100 text-blue-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-4">
                <thead>
                    <tr className="text-gray-400 text-sm uppercase tracking-wider font-semibold">
                        <th className="px-4 py-2">{t('appointments_table.date') || 'Дата'}</th>
                        <th className="px-4 py-2">{t('appointments_table.time') || 'Время'}</th>
                        <th className="px-4 py-2">{t('appointments_table.service') || 'Услуга'}</th>
                        <th className="px-4 py-2">{t('appointments_table.status') || 'Статус'}</th>
                        <th className="px-4 py-2">{t('appointments_table.dentist') || 'Врач'}</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((app) => (
                        <tr key={app.id} className="bg-white border hover:shadow-md transition-shadow group">
                            <td className="px-4 py-5 first:rounded-l-[20px] last:rounded-r-[20px] border-y first:border-l last:border-r border-gray-100">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-[#5377f7]" />
                                    <span className="font-bold text-[#1e2235]">{formatDate(app.start_time)}</span>
                                </div>
                            </td>
                            <td className="px-4 py-5 border-y border-gray-100">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-gray-400" />
                                    <span className="font-semibold text-gray-600">{formatTime(app.start_time)}</span>
                                </div>
                            </td>
                            <td className="px-4 py-5 border-y border-gray-100">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-gray-400" />
                                    <span className="font-bold text-[#1e2235]">{app.service || 'Общий осмотр'}</span>
                                </div>
                            </td>
                            <td className="px-4 py-5 border-y border-gray-100">
                                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tight ${getStatusColor(app.status)}`}>
                                    {t(`appointments_table.status_${app.status}`) || app.status}
                                </span>
                            </td>
                            <td className="px-4 py-5 first:rounded-l-[20px] last:rounded-r-[20px] border-y first:border-l last:border-r border-gray-100">
                                <span className="font-medium text-gray-500">{app.dentist_name || 'Врач'}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AppointmentsView;
