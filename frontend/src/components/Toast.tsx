import React, { useEffect } from 'react';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info' | 'warning';
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
    message, 
    type = 'success', 
    isVisible, 
    onClose,
    duration = 3000 
}) => {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    const bgColors = {
        success: 'bg-[#00e396]',
        error: 'bg-[#ff4560]',
        info: 'bg-[#4f6bff]',
        warning: 'bg-[#feb019]'
    };

    const shadowColors = {
        success: 'shadow-[#00e396]/20',
        error: 'shadow-[#ff4560]/30',
        info: 'shadow-[#4f6bff]/20',
        warning: 'shadow-[#feb019]/30'
    };

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-2 fade-in duration-500">
            <div className={`${bgColors[type]} ${shadowColors[type]} rounded-[16px] px-6 py-3 flex items-center gap-3 shadow-lg`}>
                <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
                <span className="text-white font-bold text-sm md:text-[15px]">
                    {message}
                </span>
            </div>
        </div>
    );
};

export default Toast;
