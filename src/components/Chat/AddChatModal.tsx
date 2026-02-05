import { useState } from 'react';
import { X, Phone, Check, User } from 'lucide-react';

interface AddChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (name: string, phoneNumber: string) => void;
}

export default function AddChatModal({ isOpen, onClose, onAdd }: AddChatModalProps) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [name, setName] = useState('');

    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-[500px] rounded-[40px] p-8 shadow-2xl animate-in zoom-in-95 duration-300 relative"
            >
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black text-[#1e2235]">Добавить чат</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} className="text-gray-400" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Name Input */}
                    <div className="flex items-center gap-4 border-b-2 border-gray-100 pb-3 focus-within:border-[#5377f7] transition-colors group">
                        <User className="text-gray-400 group-focus-within:text-[#5377f7] transition-colors" size={24} />
                        <input
                            autoFocus
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Имя пациента"
                            className="bg-transparent border-none outline-none flex-1 text-xl font-medium placeholder:text-gray-300"
                        />
                    </div>

                    {/* Phone Input with Mask Placeholder Style */}
                    <div className="flex items-center gap-4 border-b-2 border-gray-100 pb-3 focus-within:border-[#5377f7] transition-colors group">
                        <Phone className="text-gray-400 group-focus-within:text-[#5377f7] transition-colors" size={24} />
                        <div className="flex-1 flex items-center text-xl font-medium tracking-wider">
                            <span className="text-[#1e2235] mr-2">+998</span>
                            <input
                                type="text"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="-- --- -- --"
                                className="bg-transparent border-none outline-none flex-1 placeholder:text-gray-300"
                            />
                        </div>
                    </div>

                    {/* Matched User Card */}
                    <div className="bg-white border-2 border-gray-100 rounded-[24px] p-3 flex items-center gap-4 shadow-sm hover:border-[#1e2235] transition-all cursor-pointer group">
                        <div className="relative">
                            <img
                                src="https://i.pravatar.cc/150?u=michail"
                                alt="Matched User"
                                className="w-14 h-14 rounded-full object-cover"
                            />
                            <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white w-5 h-5 rounded-full flex items-center justify-center">
                                <Check size={12} className="text-white" strokeWidth={4} />
                            </div>
                        </div>
                        <span className="text-xl font-bold text-[#1e2235]">Михайло Яйкин</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 mt-10">
                        <button
                            onClick={onClose}
                            className="flex-1 py-4 bg-[#e0e0e0] text-[#1e2235] font-black rounded-[20px] text-lg hover:bg-gray-300 transition-all active:scale-[0.98]"
                        >
                            Отмена
                        </button>
                        <button
                            onClick={() => onAdd(name, phoneNumber)}
                            className="flex-1 py-4 bg-[#1e2235] text-white font-black rounded-[20px] text-lg hover:bg-black shadow-lg shadow-[#1e2235]/20 transition-all active:scale-[0.98]"
                        >
                            Применить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
