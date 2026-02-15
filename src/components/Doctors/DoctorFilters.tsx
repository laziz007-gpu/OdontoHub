import React from 'react';
import { useNavigate } from 'react-router-dom';
import goBackIcon from '../../assets/img/icons/GoBack.svg';


interface DoctorFiltersProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    location: string;
    onLocationChange: (loc: string) => void;
    district: string;
    onDistrictChange: (dist: string) => void;
    rating: string;
    onRatingChange: (rate: string) => void;
}

const DoctorFilters: React.FC<DoctorFiltersProps> = ({
    searchTerm,
    onSearchChange,
    location,
    onLocationChange,
    district,
    onDistrictChange,
    rating,
    onRatingChange
}) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-4">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className=""
                >
                    <img  src={goBackIcon} alt="Go back" className="w-[50px] h-[50px] " />
                </button>

                {/* Search Bar */}
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Поиск: стоматологи"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full bg-[#E8E8E8] border border-transparent rounded-[16px] sm:rounded-[20px] py-3 sm:py-4 px-4 sm:px-6 pr-12 sm:pr-14 text-sm sm:text-base text-gray-600 placeholder-gray-500 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 bg-black rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shadow-md hover:bg-gray-800 transition-colors active:scale-95">
                        <svg width="18" height="18" className="sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Dropdowns */}
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 no-scrollbar px-1">
                <div className="relative shrink-0">
                    <select
                        value={location}
                        onChange={(e) => onLocationChange(e.target.value)}
                        className="appearance-none bg-white text-[#1D1D2B] font-bold py-2 sm:py-2.5 pl-4 sm:pl-6 pr-8 sm:pr-10 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-pointer min-w-[100px] sm:min-w-[120px] text-xs sm:text-sm text-center focus:outline-none"
                    >
                        <option value="">Ташкент</option>
                        <option value="tashkent">Ташкент</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-2 sm:right-3 flex items-center text-[#1D1D2B]">
                        <svg className="fill-current h-3 w-3 sm:h-4 sm:w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                </div>

                <div className="relative shrink-0">
                    <select
                        value={district}
                        onChange={(e) => onDistrictChange(e.target.value)}
                        className="appearance-none bg-[#4D71F8] text-white font-bold py-2 sm:py-2.5 pl-4 sm:pl-6 pr-8 sm:pr-10 rounded-full shadow-md shadow-blue-500/30 cursor-pointer min-w-[110px] sm:min-w-[130px] text-xs sm:text-sm text-center focus:outline-none border-none"
                    >
                        <option value="">Юнусабад</option>
                        <option value="yunusabad">Юнусабад</option>
                        <option value="chilonzor">Чиланзар</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-2 sm:right-3 flex items-center text-white">
                        <svg className="fill-current h-3 w-3 sm:h-4 sm:w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                </div>

                <div className="relative shrink-0">
                    <select
                        value={rating}
                        onChange={(e) => onRatingChange(e.target.value)}
                        className="appearance-none bg-white text-[#1D1D2B] font-bold py-2 sm:py-2.5 pl-4 sm:pl-6 pr-8 sm:pr-10 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-pointer min-w-[100px] sm:min-w-[120px] text-xs sm:text-sm text-center focus:outline-none"
                    >
                        <option value="">Рейтинг</option>
                        <option value="high">Высокий</option>
                        <option value="low">Низкий</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-2 sm:right-3 flex items-center text-[#1D1D2B]">
                        <svg className="fill-current h-3 w-3 sm:h-4 sm:w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorFilters;
