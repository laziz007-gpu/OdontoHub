import { Play } from "lucide-react";

interface VoiceItem {
    name: string;
    duration: string;
    date: string;
}

interface VoiceMessagesListProps {
    voiceMessages: VoiceItem[];
}

const VoiceMessagesList = ({ voiceMessages }: VoiceMessagesListProps) => {
    return (
        <div className="space-y-1">
            {voiceMessages.map((voice, idx) => (
                <div key={idx} className="flex items-center gap-4 py-4 border-b border-gray-50 last:border-0 group cursor-pointer hover:bg-gray-50/50 px-2 rounded-2xl transition-colors">
                    <div className="w-12 h-12 bg-[#4B69FF] rounded-full flex items-center justify-center relative shrink-0">
                        <Play size={20} className="text-white fill-white ml-0.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-[17px] font-black text-[#1D1D2B] truncate">{voice.name}</h4>
                        <p className="text-[13px] font-bold text-gray-400 mt-0.5">
                            {voice.duration} <span className="mx-1">•</span> {voice.date}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default VoiceMessagesList;
