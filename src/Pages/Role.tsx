import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { User, Stethoscope } from "lucide-react";
import { paths } from "../Routes/path";
import logo from "../assets/img/icons/Logo.svg";
import type { RootState } from "../store/store";
import { useTranslation } from "react-i18next";

export default function Role() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const role = useSelector((state: RootState) => state.user.role);

  useEffect(() => {
    if (role === 'dentist') {
      navigate(paths.menu, { replace: true });
    } else if (role === 'patient') {
      navigate(paths.patientHome, { replace: true });
    }
  }, [role, navigate]);

  return (
    <div className="min-h-screen bg-blue-600 flex flex-col items-center justify-center p-6 text-white text-center">
      <div className="mb-8">
        <img src={logo} alt="Logo" className="w-24 h-24" />
      </div>

      <h1 className="text-3xl font-bold mb-2">{t('auth.role_welcome')}</h1>
      <p className="opacity-80 mb-12">{t('auth.role_subtitle_choose')}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
        <button
          onClick={() => navigate(paths.menu)}
          className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl flex flex-col items-center gap-4 hover:bg-white/20 transition-all active:scale-95 group"
        >
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-lg group-hover:scale-110 transition-transform">
            <Stethoscope size={32} />
          </div>
          <span className="text-xl font-bold">{t('auth.role_dentist_label')}</span>
        </button>

        <button
          onClick={() => navigate(paths.patientHome)}
          className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl flex flex-col items-center gap-4 hover:bg-white/20 transition-all active:scale-95 group"
        >
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-lg group-hover:scale-110 transition-transform">
            <User size={32} />
          </div>
          <span className="text-xl font-bold">{t('auth.role_patient_label')}</span>
        </button>
      </div>

      <p className="mt-12 text-sm opacity-60">
        {t('auth.footer_text')}
      </p>
    </div>
  );
}
