import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { clearUser } from '../../store/slices/userSlice';
import { paths } from '../../Routes/path';
import { useDeleteAccount } from '../../api/auth';

export const PrivacySettings: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const deleteAccountMutation = useDeleteAccount();

    const handleLogout = () => {
        // 1. Очищаем токен
        localStorage.removeItem('access_token');
        // 2. Очищаем Redux state
        dispatch(clearUser());
        // 3. Редирект на вход
        navigate(paths.login, { replace: true });
    };

    const handleDeleteAccount = async () => {
        try {
            await deleteAccountMutation.mutateAsync();
            dispatch(clearUser());
            navigate(paths.login, { replace: true });
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Failed to delete account', error);
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
                className="bg-white p-5 rounded-2xl cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setIsDeleteModalOpen(true)}
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
            {isDeleteModalOpen && (
                <div onClick={() => setIsDeleteModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200"
                    >
                        <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                            <Trash2 className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">{t('common.delete_account')}</h2>
                        <p className="text-gray-600 text-center mb-6">{t('common.delete_account_warning')}</p>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleteAccountMutation.isPending}
                                className="flex-1 py-3 px-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {deleteAccountMutation.isPending ? t('common.loading') : t('common.delete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
