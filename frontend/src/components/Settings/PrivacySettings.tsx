import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearUser } from '../../store/slices/userSlice';
import { paths } from '../../Routes/path';

export const PrivacySettings: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_data');
        dispatch(clearUser());
        navigate(paths.login, { replace: true });
    };

    const handleDeleteAccount = async () => {
        setDeleting(true);
        try {
            const token = localStorage.getItem('access_token');
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

            if (token && import.meta.env.VITE_USE_API === 'true') {
                await fetch(`${apiUrl}/auth/delete-account`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }
        } catch (e) {
            // ignore errors, still clear local data
        } finally {
            localStorage.clear();
            dispatch(clearUser());
            navigate(paths.login, { replace: true });
        }
    };

    return (
        <div className="space-y-4">
            <button className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-2xl text-sm mb-6 transition-colors">
                {t('settings.privacy.change_password')}
            </button>

            <div className="bg-[#94A4FF] p-5 rounded-2xl cursor-pointer hover:opacity-90 transition-opacity">
                <h3 className="text-lg font-bold text-white mb-1">{t('settings.privacy.active_sessions_title')}</h3>
                <p className="text-sm text-white/90">{t('settings.privacy.active_sessions_desc')}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl cursor-pointer hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-[#1E2532] mb-1">{t('settings.privacy.add_device_title')}</h3>
                <p className="text-sm text-gray-400">{t('settings.privacy.add_device_desc')}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl cursor-pointer hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-[#1E2532] mb-1">{t('settings.privacy.backup_number_title')}</h3>
                <p className="text-sm text-gray-400">{t('settings.privacy.backup_number_desc')}</p>
            </div>

            <div
                onClick={() => setShowDeleteModal(true)}
                className="bg-white p-5 rounded-2xl cursor-pointer hover:shadow-md transition-shadow"
            >
                <h3 className="text-lg font-bold text-red-500 underline mb-1">{t('settings.privacy.delete_account_title')}</h3>
                <p className="text-sm text-gray-400">{t('settings.privacy.delete_account_desc')}</p>
            </div>

            <div className="pt-20">
                <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-12 rounded-2xl text-sm transition-colors"
                >
                    {t('settings.privacy.logout')}
                </button>
            </div>

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
                        <h2 className="text-xl font-bold text-[#1E2532] mb-2">Hisobni o'chirish</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Haqiqatan ham hisobingizni o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition"
                            >
                                Bekor qilish
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleting}
                                className="flex-1 py-3 rounded-2xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition disabled:opacity-50"
                            >
                                {deleting ? "O'chirilmoqda..." : "O'chirish"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
