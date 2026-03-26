import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
    id: string;
    message: string;
    type: ToastType;
}

// Global toast state
let toastListeners: ((toasts: ToastItem[]) => void)[] = [];
let toasts: ToastItem[] = [];

function notify(listeners: typeof toastListeners, items: ToastItem[]) {
    listeners.forEach(fn => fn([...items]));
}

export const toast = {
    show(message: string, type: ToastType = "info") {
        const id = Math.random().toString(36).slice(2);
        toasts = [...toasts, { id, message, type }];
        notify(toastListeners, toasts);
        setTimeout(() => {
            toasts = toasts.filter(t => t.id !== id);
            notify(toastListeners, toasts);
        }, 3500);
    },
    success(message: string) { this.show(message, "success"); },
    error(message: string) { this.show(message, "error"); },
    warning(message: string) { this.show(message, "warning"); },
    info(message: string) { this.show(message, "info"); },
};

const icons = {
    success: <CheckCircle size={20} className="text-emerald-500 shrink-0" />,
    error: <XCircle size={20} className="text-red-500 shrink-0" />,
    warning: <AlertCircle size={20} className="text-amber-500 shrink-0" />,
    info: <Info size={20} className="text-blue-500 shrink-0" />,
};

const bars = {
    success: "bg-emerald-500",
    error: "bg-red-500",
    warning: "bg-amber-500",
    info: "bg-blue-500",
};

function ToastCard({ item, onClose }: { item: ToastItem; onClose: () => void }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    return (
        <div
            className={`relative flex items-start gap-3 bg-white rounded-2xl shadow-xl px-4 py-3.5 min-w-[280px] max-w-[360px] border border-gray-100 overflow-hidden
                transition-all duration-300 ease-out
                ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
            {/* color bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${bars[item.type]}`} />
            <div className="mt-0.5">{icons[item.type]}</div>
            <p className="text-sm font-semibold text-[#1D1D2B] flex-1 leading-snug">{item.message}</p>
            <button onClick={handleClose} className="text-gray-300 hover:text-gray-500 transition-colors mt-0.5">
                <X size={16} />
            </button>
        </div>
    );
}

export function ToastContainer() {
    const [items, setItems] = useState<ToastItem[]>([]);

    useEffect(() => {
        toastListeners.push(setItems);
        return () => {
            toastListeners = toastListeners.filter(fn => fn !== setItems);
        };
    }, []);

    const remove = (id: string) => {
        toasts = toasts.filter(t => t.id !== id);
        notify(toastListeners, toasts);
    };

    if (!items.length) return null;

    return (
        <div className="fixed bottom-6 right-4 z-[9999] flex flex-col gap-3 items-end pointer-events-none">
            {items.map(item => (
                <div key={item.id} className="pointer-events-auto">
                    <ToastCard item={item} onClose={() => remove(item.id)} />
                </div>
            ))}
        </div>
    );
}
