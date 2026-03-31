import { useState, useRef, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Check } from 'lucide-react';
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

interface DropdownOption { value: string; label: string; }

interface CustomDropdownProps {
    value: string;
    onChange: (val: string) => void;
    options: DropdownOption[];
    active?: boolean;
}

const CustomDropdown = ({ value, onChange, options, active }: CustomDropdownProps) => {
    const [open, setOpen] = useState(false);
    const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
    const ref = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);
    const selected = options.find(o => o.value === value) || options[0];

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleOpen = () => {
        if (!open && btnRef.current) {
            const rect = btnRef.current.getBoundingClientRect();
            setMenuStyle({
                position: 'fixed',
                top: rect.bottom + 6,
                left: rect.left,
                zIndex: 9999,
                minWidth: 150,
            });
        }
        setOpen(o => !o);
    };

    return (
        <div ref={ref} className="relative shrink-0">
            <button
                ref={btnRef}
                onClick={handleOpen}
                className={`flex items-center gap-1 font-bold py-2 px-3 sm:px-4 rounded-full text-xs sm:text-sm transition-all active:scale-95 whitespace-nowrap ${
                    active
                        ? 'bg-[#4D71F8] text-white shadow-md shadow-blue-400/30'
                        : 'bg-gray-100 text-[#1D1D2B] hover:bg-gray-200'
                }`}
            >
                {selected.label}
                <ChevronDown size={12} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div style={menuStyle} className="rounded-2xl shadow-2xl border border-gray-100 overflow-hidden bg-white">
                    {options.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => { onChange(opt.value); setOpen(false); }}
                            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-blue-50 ${
                                value === opt.value ? 'text-[#4D71F8] bg-blue-50/50' : 'text-[#1D1D2B]'
                            }`}
                        >
                            {opt.label}
                            {value === opt.value && <Check size={13} className="text-[#4D71F8] ml-2" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const DoctorFilters = ({
    searchTerm, onSearchChange,
    location, onLocationChange,
    district, onDistrictChange,
    rating, onRatingChange,
}: DoctorFiltersProps) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col gap-2 mb-3">
            {/* Search row */}
            <div className="flex items-center gap-2">
                <button onClick={() => navigate(-1)} className="shrink-0">
                    <img src={goBackIcon} alt="Go back" className="w-10 h-10 sm:w-12 sm:h-12" />
                </button>
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Поиск: стоматологи"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full bg-[#E8E8E8] rounded-2xl py-2.5 sm:py-3 px-4 sm:px-5 pr-11 text-sm text-gray-600 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-black rounded-full w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center hover:bg-gray-800 transition-colors active:scale-95">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Filter pills */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                <CustomDropdown
                    value={location}
                    onChange={onLocationChange}
                    options={[{ value: 'tashkent', label: 'Ташкент' }]}
                />
                <CustomDropdown
                    value={district}
                    onChange={onDistrictChange}
                    active={district !== 'all'}
                    options={[
                        { value: 'all', label: 'Все районы' },
                        { value: 'yunusabad', label: 'Юнусабад' },
                        { value: 'chilonzor', label: 'Чиланзар' },
                        { value: 'mirabad', label: 'Мирабад' },
                        { value: 'sergeli', label: 'Сергели' },
                    ]}
                />
                <CustomDropdown
                    value={rating}
                    onChange={onRatingChange}
                    active={rating !== ''}
                    options={[
                        { value: '', label: 'Рейтинг' },
                        { value: 'high', label: 'Высокий' },
                        { value: 'low', label: 'Низкий' },
                    ]}
                />
            </div>
        </div>
    );
};

export default DoctorFilters;
