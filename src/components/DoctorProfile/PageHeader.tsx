import React, { type FC } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { paths } from '../../Routes/path';

const PageHeader: FC = () => {
    return (
        <div className="flex items-center gap-4 mb-8">
            <Link
                to={paths.menu}
                className="w-8 h-8 flex items-center justify-center bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-3xl font-bold text-[#1E2532]">Профиль</h1>
        </div>
    );
};

export default PageHeader;
