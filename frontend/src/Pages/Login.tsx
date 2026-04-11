import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { setUser } from '../store/slices/userSlice'
import type { LoginData } from '../interfaces'
import api from '../api/api'
import logo from '../assets/img/icons/Logo.svg'
import { paths } from '../Routes/path'
import { toast } from '../components/Shared/Toast'

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>()

  const onSubmit = async (data: LoginData) => {
    const cleanPhone = data.phone.replace(/\s+/g, '');
    const useAPI = import.meta.env.VITE_USE_API === 'true';

    if (useAPI) {
      try {
        const result = await api.post('/auth/login', { 
          phone: cleanPhone,
          password: data.password 
        });
        const { access_token } = result.data;
        localStorage.setItem('access_token', access_token);

        const meResponse = await api.get('/auth/me', {
          headers: { 'Authorization': `Bearer ${access_token}` }
        });
        const userData = meResponse.data;
        localStorage.setItem('user_data', JSON.stringify(userData));
        dispatch(setUser(userData));

        if (userData.role === 'patient') {
          navigate(paths.patientHome, { replace: true });
        } else {
          navigate(paths.menu, { replace: true });
        }
      } catch (err: any) {
        const detail = err.response?.data?.detail;
        if (detail) {
          toast.error(detail);
        } else {
          toast.error('Ошибка подключения к серверу');
        }
      }
      return;
    }

    // Local mode
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.phone === cleanPhone) {
        localStorage.setItem('access_token', 'local_token_' + Date.now());
        dispatch(setUser(user));
        if (user.role === 'patient') {
          navigate(paths.patientHome, { replace: true });
        } else {
          navigate(paths.menu, { replace: true });
        }
        return;
      }
    }

    toast.error(t("patient.alerts.user_not_found"));
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-6">
        <img src={logo} alt="OdontoHub" className="w-20 h-20" />
      </div>

      <h1 className="text-3xl font-bold text-white mb-2">Вход</h1>
      <p className="text-white/70 mb-8">Войдите по номеру телефона</p>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Номер телефона
            </label>
            <input
              type="tel"
              placeholder="+998 90 123 45 67"
              className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-400' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
              {...register('phone', {
                required: 'Введите номер телефона',
                validate: (value) => {
                  const cleaned = value.replace(/\s+/g, '');
                  return /^\+998\d{9}$/.test(cleaned) || 'Неверный формат номера';
                }
              })}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Пароль
            </label>
            <input
              type="password"
              placeholder="Введите пароль"
              className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-red-400' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
              {...register('password', {
                required: 'Введите пароль',
                minLength: { value: 6, message: 'Минимум 6 символов' }
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 active:scale-[0.98] transition-all"
          >
            Войти
          </button>
        </form>

        {/* Register link */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Нет аккаунта?{' '}
          <Link to={paths.registerPat} className="text-blue-600 font-medium hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  )
}
