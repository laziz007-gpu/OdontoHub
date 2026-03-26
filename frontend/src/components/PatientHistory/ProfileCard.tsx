import type { PatientHistoryProfile } from "../../types/patient";
import avatar from "../../assets/img/photos/Dentist.png";
interface ProfileCardProps {
    profile: PatientHistoryProfile;
}

const ProfileCard = ({ profile }: ProfileCardProps) => {
    return (
        <div className="bg-linear-to-br from-blue-600 to-blue-700 rounded-4xl p-6 md:p-8 flex flex-col md:flex-row gap-8 relative shadow-[0_10px_30px_rgba(37,99,235,0.2)] text-white">
            <div className="flex-1 space-y-4">
                <div className="space-y-0.5">
                    <p className="text-[10px] md:text-xs uppercase font-black tracking-widest opacity-70">ID-пациента:</p>
                    <p className="text-xl md:text-2xl font-black">{profile.id}</p>
                </div>
                <div className="space-y-0.5">
                    <p className="text-[10px] md:text-xs uppercase font-black tracking-widest opacity-70">Дата рождения:</p>
                    <p className="text-xl md:text-2xl font-black">{profile.dob}</p>
                </div>
                <div className="space-y-0.5">
                    <p className="text-[10px] md:text-xs uppercase font-black tracking-widest opacity-70">Пол:</p>
                    <p className="text-xl md:text-2xl font-black">{profile.gender}</p>
                </div>
                <div className="space-y-0.5">
                    <p className="text-[10px] md:text-xs uppercase font-black tracking-widest opacity-70">Контакт:</p>
                    <p className="text-xl md:text-2xl font-black">{profile.phone}</p>
                </div>
                <div className="space-y-0.5">
                    <p className="text-[10px] md:text-xs uppercase font-black tracking-widest opacity-70">Дата регистрации:</p>
                    <p className="text-xl md:text-2xl font-black">{profile.registrationDate}</p>
                </div>
            </div>
            <div className="">
                <img src={avatar} alt={profile.name} className=" " />
            </div>
        </div>
    );
};

export default ProfileCard;
