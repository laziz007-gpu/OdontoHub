import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

const SearchBar = () => {
    const { t } = useTranslation();

    return (
        <div className="relative max-w-2xl mx-auto w-full">
            <input
                type="text"
                placeholder={t("patient.home.search")}
                className="w-full bg-white border-none rounded-full py-5 pl-14 pr-6 text-lg font-bold text-gray-700 shadow-xl shadow-blue-500/5 focus:ring-2 focus:ring-blue-500/20"
            />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
        </div>
    );
};

export default SearchBar;
