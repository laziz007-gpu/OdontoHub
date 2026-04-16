import React, { type FC } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { paths } from '../../Routes/path';
import { useTranslation } from 'react-i18next';

const PageHeader: FC = () => {
    const { t } = useTranslation();
    return (
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                <Link
                    to={paths.menu}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white transition-colors hover:bg-gray-800 sm:h-10 sm:w-10"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Link>
                <h1 className="truncate text-2xl font-bold text-[#1E2532] sm:text-3xl">{t('patient_profile.profile')}</h1>
            </div>
            <Link
                to={paths.editProfile}
                className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:w-auto sm:px-6"
            >
                {t('doctor_profile.edit')}
            </Link>
        </div>
    );
};

export default PageHeader;
