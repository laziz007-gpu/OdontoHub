import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ActionButtons = ({ phone }: { phone?: string }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [newDate, setNewDate] = useState("");
    const [copied, setCopied] = useState(false);



    const handleCopy = () => {
        if (phone) {
            navigator.clipboard.writeText(phone);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleCancel = () => {
        if (confirm(t("patient.appointment_detail.cancel_confirm"))) {
            // Check if local mode
            const accessToken = localStorage.getItem('access_token');
            const isLocalMode = accessToken?.startsWith('local_token_');

            if (isLocalMode) {
                // Remove appointment from localStorage
                const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
                const updatedAppointments = appointments.filter((app: any) => app.id.toString() !== id);
                localStorage.setItem('appointments', JSON.stringify(updatedAppointments));

                alert(t("patient.alerts.appointment_cancelled"));
                navigate('/calendar');
            }
        }
    };

    const handleReschedule = () => {
        setShowRescheduleModal(true);
    };

    const confirmReschedule = () => {
        if (!newDate) {
            alert(t("patient.alerts.select_new_date"));
            return;
        }

        // Check if local mode
        const accessToken = localStorage.getItem('access_token');
        const isLocalMode = accessToken?.startsWith('local_token_');

        if (isLocalMode) {
            // Update appointment date in localStorage
            const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
            const updatedAppointments = appointments.map((app: any) => {
                if (app.id.toString() === id) {
                    return { ...app, date: new Date(newDate).toLocaleDateString('ru-RU') };
                }
                return app;
            });
            localStorage.setItem('appointments', JSON.stringify(updatedAppointments));

            alert(t("patient.alerts.appointment_rescheduled") + " " + new Date(newDate).toLocaleDateString('ru-RU'));
            setShowRescheduleModal(false);
            navigate('/calendar');
        }
    };

    return (
        <>
            <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5">
                <div className="flex gap-3 sm:gap-4 lg:gap-5">
                    <button
                        onClick={() => setShowContactModal(true)}
                        className="flex-1 bg-[#11D76A] text-white py-3 sm:py-4 lg:py-5 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] text-sm sm:text-base lg:text-2xl font-bold shadow-lg shadow-green-500/20 hover:bg-[#0fc460] transition-all active:scale-95 flex items-center justify-center"
                    >
                        Связаться
                    </button>
                    <button
                        onClick={handleReschedule}
                        className="flex-1 bg-[#FBBC05] text-white py-3 sm:py-4 lg:py-5 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] text-sm sm:text-base lg:text-2xl font-bold shadow-lg shadow-yellow-500/20 hover:bg-[#e0a800] transition-all active:scale-95"
                    >
                        Перенести
                    </button>
                </div>
                <button
                    onClick={handleCancel}
                    className="w-full bg-[#EA4335] text-white py-3 sm:py-4 lg:py-5 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] text-sm sm:text-base lg:text-2xl font-bold shadow-lg shadow-red-500/20 hover:bg-[#d63b2f] transition-all active:scale-95"
                >
                    Отмененить
                </button>
            </div>

            {/* Reschedule Modal */}
            {showRescheduleModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <h3 className="text-2xl font-black text-gray-900 mb-6">Перенести приём</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Выберите новую дату</label>
                                <input
                                    type="date"
                                    value={newDate}
                                    onChange={(e) => setNewDate(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowRescheduleModal(false)}
                                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
                                >
                                    Отмена
                                </button>
                                <button
                                    onClick={confirmReschedule}
                                    className="flex-1 bg-[#FBBC05] text-white py-3 rounded-xl font-bold hover:bg-[#e0a800] transition-all"
                                >
                                    Подтвердить
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Contact Modal */}
            {showContactModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
                        <h3 className="text-2xl font-black text-gray-900 mb-2">Связаться с врачом</h3>
                        <p className="text-gray-500 mb-6 font-medium">Выберите удобный способ связи</p>

                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                                <span className="text-xl font-bold text-gray-900">{phone || "Номер не указан"}</span>
                                <button
                                    onClick={handleCopy}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${copied ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                                >
                                    {copied ? "Скопировано!" : "Копировать"}
                                </button>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowContactModal(false)}
                                    className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95"
                                >
                                    Отмена
                                </button>
                                {phone && (
                                    <a
                                        href={`tel:${phone}`}
                                        className="flex-3 bg-[#11D76A] text-white py-4 rounded-2xl font-bold hover:bg-[#0fc460] transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-green-500/20 text-lg"
                                    >
                                        Позвонить
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ActionButtons;
