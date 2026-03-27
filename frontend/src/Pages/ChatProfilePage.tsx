import { useState } from "react";
import DentistImg from "../assets/img/photos/Dentist.png";
import ProfileHeader from "../components/ChatProfile/ProfileHeader";
import ProfileInfo from "../components/ChatProfile/ProfileInfo";
import MediaTabs from "../components/ChatProfile/MediaTabs";
import MediaGrid from "../components/ChatProfile/MediaGrid";
import FilesList from "../components/ChatProfile/FilesList";
import VoiceMessagesList from "../components/ChatProfile/VoiceMessagesList";
import LinksList from "../components/ChatProfile/LinksList";

interface LinkItem {
    name: string;
    date: string;
    url: string;
}

interface VoiceItem {
    name: string;
    duration: string;
    date: string;
}

interface FileItem {
    name: string;
    size: string;
    date: string;
    type: 'doc' | 'xls' | 'zip' | 'pdf';
}

const ChatProfilePage = () => {
    const [activeTab, setActiveTab] = useState('Медиа');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const files: FileItem[] = [
        { name: 'Diagnoz.doc', size: '450 KB', date: '12.05.2026', type: 'doc' },
        { name: 'Tablitsa.xls', size: '11 MB', date: '12.05.2026', type: 'xls' },
        { name: 'Diagnoz.zip', size: '2,8 MB', date: '12.05.2026', type: 'zip' },
        { name: 'Diagnoz.pdf', size: '2,8 MB', date: '12.05.2026', type: 'pdf' },
    ];

    const voiceMessages: VoiceItem[] = [
        { name: 'User-1', duration: '1:30', date: '12.05.2026' },
        { name: 'User-2', duration: '0:28', date: '12.05.2026' },
    ];

    const links: LinkItem[] = [
        { name: 'OdontoHUB', url: 'https://www.OdontoHUB.uz', date: '12.05.2026' },
    ];

    return (
        <div className="min-h-screen  pb-10">
            {/* Centered Main Area */}
            <div className="max-w-2xl mx-auto w-full px-4 pt-6 space-y-4">

                {/* Profile Card */}
                <div className="bg-white rounded-[40px] p-8 shadow-sm relative overflow-hidden">
                    <ProfileHeader 
                        isMenuOpen={isMenuOpen} 
                        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} 
                    />
                    <ProfileInfo 
                        avatar={DentistImg}
                        name="Алишер Насруллаев"
                        status="Был(а) недавно"
                        phone="+998 90 455 0556"
                    />
                </div>

                {/* Media Content Card */}
                <div className="bg-white rounded-[40px] p-6 shadow-sm min-h-[500px]">
                    <MediaTabs activeTab={activeTab} onTabChange={setActiveTab} />

                    {/* Content Section */}
                    {activeTab === 'Медиа' && <MediaGrid />}
                    {activeTab === 'Файлы' && <FilesList files={files} />}
                    {activeTab === 'Голосовые' && <VoiceMessagesList voiceMessages={voiceMessages} />}
                    {activeTab === 'Ссылки' && <LinksList links={links} />}
                </div>

            </div>
        </div>
    );
};

export default ChatProfilePage;
