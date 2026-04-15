import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { User, Stethoscope } from "lucide-react";
import { paths } from "../Routes/path";
import GoSmileLogo from "../assets/img/icons/logo1.png";
import { RootState } from "../store/store";

export default function Role() {
  const navigate = useNavigate();
  const role = useSelector((state: RootState) => state.user.role);

  useEffect(() => {
    if (role === 'dentist') {
      navigate(paths.menu, { replace: true });
    } else if (role === 'patient') {
      navigate(paths.patientHome, { replace: true });
    }
  }, [role, navigate]);

  return (
    <div className="min-h-screen gradient-primary flex flex-col items-center justify-center p-6 text-white text-center">
      <div className="mb-8">
        <img src={GoSmileLogo} alt="GoSmile" />
      </div>

      <h1 className="text-3xl font-heading font-bold mb-2">Добро пожаловать!</h1>
      <p className="opacity-80 mb-12 font-railway">Выберите вашу роль в системе GoSmile</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
        <button
          onClick={() => navigate(paths.menu)}
          className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl flex flex-col items-center gap-4 hover:bg-white/20 transition-all active:scale-95 group"
        >
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-lg group-hover:scale-110 transition-transform">
            <Stethoscope size={32} />
          </div>
          <span className="text-xl font-bold">Я врач</span>
        </button>

        <button
          onClick={() => navigate(paths.patientHome)}
          className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl flex flex-col items-center gap-4 hover:bg-white/20 transition-all active:scale-95 group"
        >
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-lg group-hover:scale-110 transition-transform">
            <User size={32} />
          </div>
          <span className="text-xl font-bold">Я пациент</span>
        </button>
      </div>

      <p className="mt-12 text-sm opacity-60">
        OdontoHub — ваша современная стоматология
      </p>
    </div>
  );
}
