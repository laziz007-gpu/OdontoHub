import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useLogin } from '../api/auth'
import type { LoginData } from '../interfaces'
import { Eye, EyeOff } from 'lucide-react'
import logo from '../assets/img/icons/Logo.svg'
import { paths } from '../Routes/path'

export default function Login() {
  const navigate = useNavigate()
  const { mutate: login, isPending, error } = useLogin()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>()

  const onSubmit = (data: LoginData) => {
    // Чистим телефон от пробелов перед отправкой
    const cleanData = {
      ...data,
      username: data.username.replace(/\s+/g, ''),
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
      <p className="text-white/70 mb-8">Войдите в свой аккаунт</p>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username / Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Телефон или имя пользователя
            </label>
            <input
              type="text"
              placeholder="+998 90 123 45 67"
              className={`w-full px-4 py-3 rounded-xl border ${errors.username ? 'border-red-400' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
              {...register('username', {
                required: 'Введите телефон или имя пользователя',
              })}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Пароль
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-red-400' : 'border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-12`}
                {...register('password', {
                  required: 'Введите пароль',
                  minLength: { value: 4, message: 'Минимум 4 символа' },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Error from server */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
              {error instanceof Error ? error.message : 'Неверный логин или пароль'}
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
