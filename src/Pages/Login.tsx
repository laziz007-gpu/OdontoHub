import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useLogin } from '../api/auth'
import type { LoginData } from '../interfaces'
import logo from '../assets/img/icons/Logo.svg'
import { paths } from '../Routes/path'

export default function Login() {
  const navigate = useNavigate()
  const { mutate: login, isPending, error } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>()

  const onSubmit = (data: LoginData) => {
    // Чистим телефон от пробелов перед отправкой
    const cleanData = {
      phone: data.phone.replace(/\s+/g, ''),
    }

    login(cleanData, {
      onSuccess: () => {
        navigate(paths.role, { replace: true })
      },
    })
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
                pattern: {
                  value: /^\+998\d{9}$/,
                  message: 'Неверный формат номера'
                }
              })}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
            )}
          </div>

          {/* Error from server */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
              {error instanceof Error ? error.message : 'Пользователь не найден'}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Вход...
              </span>
            ) : (
              'Войти'
            )}
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
