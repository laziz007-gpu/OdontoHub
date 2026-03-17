import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

const SearchBar = () => {
    const { t } = useTranslation();
    const [userName, setUserName] = useState<string>("");

    useEffect(() => {
        // Get user data from localStorage
        const userData = localStorage.getItem('user_data');
        if (userData) {
            const user = JSON.parse(userData);
            setUserName(user.full_name || "");
        }
    }, []);

    return (
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Greeting */}
            {userName && (
                <div className="text-center sm:text-left">
                    <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black text-blue-900">
                        {t("patient.home.greeting", { name: userName })} 👋
                    </h1>
                    <p className="text-sm sm:text-base lg:text-xl text-gray-500 mt-1 sm:mt-2 font-semibold">
                        {t("patient.home.greeting_subtitle")}
                    </p>
                </div>
            )}

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto w-full">
                <input
                    type="text"
                    placeholder={t("patient.home.search")}
                    className="w-full bg-white border-none rounded-full py-4 sm:py-5 lg:py-6 pl-12 sm:pl-14 lg:pl-16 pr-4 sm:pr-6 text-base sm:text-lg lg:text-xl font-bold text-gray-700 shadow-xl shadow-blue-500/5 focus:ring-2 focus:ring-blue-500/20"
                />
                <Search className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            </div>
        </div>
    );
};

export default SearchBar;
