import { useNavigate } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import { paths } from '../../Routes/path';

interface Specialty {
    id: string;
    name: string;
    description: string;
    count: number;
}

const specialties: Specialty[] = [
    {
        id: 'therapist',
        name: 'Терапевт',
        description: 'Лечение кариеса, каналов',
        count: 245
    },
    {
        id: 'surgeon',
        name: 'Хирург',
        description: 'Удаление, имплантация',
        count: 245
    },
    {
        id: 'orthopedist',
        name: 'Ортопед',
        description: 'Протезирование, виниры',
        count: 245
    },
    {
        id: 'orthodontist',
        name: 'Ортодонт',
        description: 'Исправление прикуса',
        count: 245
    },
    {
        id: 'periodontist',
        name: 'Пародонтолог',
        description: 'Лечение десен',
        count: 245
    },
    {
        id: 'pediatric',
        name: 'Детский стоматолог',
        description: 'Специфическое лечение молочных и постоянных зубов у детей с учетом психологии.',
        count: 245
    },
    {
        id: 'hygienist',
        name: 'Гигиенист',
        description: 'Профессиональная чистка зубов, снятие камня, обучение гигиене',
        count: 245
    },
    {
        id: 'aesthetic',
        name: 'Эстетик',
        description: 'Отбеливание, художественная реставрация для улучшения внешнего вида улыбки.',
        count: 245
    }
];

const SpecialtiesList: React.FC = () => {
    const navigate = useNavigate();

    const handleView = (specialty: Specialty) => {
        // Navigate to doctors list, potentially filtered by specialty in the future
        navigate(paths.doctors, { state: { specialty: specialty.name } });
    };

    return (
        <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 pb-10">
            {specialties.map((item) => (
                <div
                    key={item.id}
                    className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 lg:p-8 shadow-sm border border-white hover:border-blue-100 hover:shadow-md transition-all group"
                >
                    <div className="flex flex-col gap-3 sm:gap-4">
                        <div>
                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1D1D2B] mb-2 sm:mb-3">
                                {item.name}
                            </h3>
                            <p className="text-gray-500 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
                                {item.description}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2 sm:mt-4">
                            <button
                                onClick={() => handleView(item)}
                                className="bg-[#4D71F8] hover:bg-[#3b5cd9] text-white py-2.5 sm:py-3 px-6 sm:px-8 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 group-hover:shadow-lg group-hover:shadow-blue-500/20 self-start sm:self-auto w-full sm:w-auto"
                            >
                                <span className="text-sm sm:text-base">Посмотреть</span>
                                <FiArrowUpRight className="text-lg sm:text-xl" />
                            </button>

                            <span className="text-[#1D1D2B] font-bold text-xs sm:text-sm lg:text-base whitespace-nowrap">
                                Найдено: {item.count} специалистов
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SpecialtiesList;
