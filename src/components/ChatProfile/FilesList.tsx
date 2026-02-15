import { FileText, FileSpreadsheet, Archive, File } from "lucide-react";

interface FileItem {
    name: string;
    size: string;
    date: string;
    type: 'doc' | 'xls' | 'zip' | 'pdf';
}

interface FilesListProps {
    files: FileItem[];
}

const FilesList = ({ files }: FilesListProps) => {
    const getFileIcon = (type: string) => {
        switch (type) {
            case 'doc': return <FileText size={20} className="text-white" />;
            case 'xls': return <FileSpreadsheet size={20} className="text-white" />;
            case 'zip': return <Archive size={20} className="text-white" />;
            case 'pdf': return <File size={20} className="text-white" />;
            default: return <File size={20} className="text-white" />;
        }
    };

    const getIconBg = (type: string) => {
        switch (type) {
            case 'doc': return 'bg-[#4B69FF]';
            case 'xls': return 'bg-[#11D76A]';
            case 'zip': return 'bg-[#FFBC00]';
            case 'pdf': return 'bg-[#FF4B4B]';
            default: return 'bg-gray-400';
        }
    };

    return (
        <div className="space-y-1">
            {files.map((file, idx) => (
                <div key={idx} className="flex items-center gap-4 py-4 border-b border-gray-50 last:border-0 group cursor-pointer hover:bg-gray-50/50 px-2 rounded-2xl transition-colors">
                    <div className={`w-12 h-12 ${getIconBg(file.type)} rounded-xl flex items-center justify-center relative shrink-0`}>
                        {getFileIcon(file.type)}
                        <span className="absolute bottom-1 right-1 text-[7px] font-black text-white/80 uppercase">
                            {file.type}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-[17px] font-black text-[#1D1D2B] truncate">{file.name}</h4>
                        <p className="text-[13px] font-bold text-gray-400 mt-0.5">
                            {file.size} <span className="mx-1">•</span> {file.date}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FilesList;
