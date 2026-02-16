import React, { useState } from 'react';
import { Plus, Search, Loader2, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useServices, useDeleteService } from '../api/services';
import ServiceModal from '../components/Services/ServiceModal';

const ServicesPage: React.FC = () => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: services, isLoading } = useServices();
    const deleteService = useDeleteService();

    const filteredServices = services?.filter((service: any) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: number) => {
        if (window.confirm('Вы уверены, что хотите удалить эту услугу?')) {
            try {
                await deleteService.mutateAsync(id);
            } catch (error) {
                console.error("Failed to delete service", error);
            }
        }
    };

    return (
        <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-[#1a1f36] tracking-tight">
                        Услуги и цены
                    </h1>
                    <p className="text-gray-500 font-bold mt-2">
                        Управление списком предоставляемых услуг
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="h-12 md:h-14 px-6 md:px-8 bg-[#4f6bff] text-white font-bold rounded-[16px] shadow-lg shadow-[#4f6bff]/20 hover:bg-[#3d56d5] transition-all active:scale-95 flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5 md:w-6 md:h-6" />
                        <span className="hidden md:inline">Добавить услугу</span>
                        <span className="md:hidden">Добавить</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-xl shadow-gray-100/50 border border-gray-100">
                <div className="relative mb-6">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Поиск услуги..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-14 bg-[#f8f9fc] rounded-[20px] pl-14 pr-6 font-bold text-[#1a1f36] border-none outline-none focus:ring-2 focus:ring-[#4f6bff]/20 placeholder:text-gray-400/80 transition-all"
                    />
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-[#4f6bff]" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-gray-100">
                                    <th className="pb-4 pl-4 font-black text-gray-400 text-sm uppercase tracking-wider">Название</th>
                                    <th className="pb-4 font-black text-gray-400 text-sm uppercase tracking-wider">Цена</th>
                                    <th className="pb-4 pr-4 font-black text-gray-400 text-sm uppercase tracking-wider text-right">Действия</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredServices?.map((service: any) => (
                                    <tr key={service.id} className="group hover:bg-[#f8f9fc] transition-colors">
                                        <td className="py-4 pl-4 font-bold text-[#1a1f36] rounded-l-[16px]">
                                            {service.name}
                                        </td>
                                        <td className="py-4 font-bold text-[#4f6bff]">
                                            {service.price.toLocaleString()} {service.currency}
                                        </td>
                                        <td className="py-4 pr-4 text-right rounded-r-[16px]">
                                            <button
                                                onClick={() => handleDelete(service.id)}
                                                className="p-2 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-xl transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredServices?.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="py-12 text-center text-gray-400 font-bold">
                                            Ничего не найдено
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ServiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default ServicesPage;
