import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useRegister } from '../api/auth'
import type { RegisterData, UserRole } from '../interfaces'
import { Stethoscope, User } from 'lucide-react'
import logo from '../assets/img/icons/Logo.svg'
import { paths } from '../Routes/path'

export default function Register1() {
  const navigate = useNavigate()
  const { mutate: registerUser, isPending, error } = useRegister()
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<RegisterData, 'role'>>()

  const onSubmit = (data: Omit<RegisterData, 'role'>) => {
    if (!selectedRole) return

    // Strip spaces from phone number: "+998 90 123 45 67" -> "+998901234567"
    const cleanData = {
      ...data,
      phone: data.phone.replace(/\s+/g, ''),
      role: selectedRole
    }

    registerUser(cleanData, {
      onSuccess: () => {
        navigate(paths.role, { replace: true })
      },
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 flex flex-col items-center justify-center px-4 py-8">
      {/* Logo */}
      <div className="mb-4">
        <img src={logo} alt="OdontoHub" className="w-16 h-16" />
      </div>

      <h1 className="text-3xl font-bold text-white mb-2">Регистрация</h1>
      <p className="text-white/70 mb-6">Создайте новый аккаунт</p>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Role selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Выберите роль
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole('dentist')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${selectedRole === 'dentist'
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
              >
                <Stethoscope size={24} />
                <span className="text-sm font-medium">Врач</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('patient')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${selectedRole === 'patient'
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
              >
                <User size={24} />
                <span className="text-sm font-medium">Пациент</span>
              </button>
            </div>
            {!selectedRole && errors.full_name && (
              <p className="text-red-500 text-xs mt-1">Выберите роль</p>
            )}
          </div>

          {/* Full name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Полное имя
            </label>
            <input
              type="text"
              placeholder="Иван Иванов"
              className={`w-full px-4 py-3 rounded-xl border ${errors.full_name ? 'border-red-400' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
              {...register('full_name', {
                required: 'Введите полное имя',
                minLength: { value: 2, message: 'Минимум 2 символа' },
              })}
            />
            {errors.full_name && (
              <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>
            )}
          </div>

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

          {/* Email (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email <span className="text-gray-400">(необязательно)</span>
            </label>
            <input
              type="email"
              placeholder="example@mail.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              {...register('email')}
            />
          </div>

          {/* Error from server */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm overflow-x-auto">
              <p className="font-bold mb-1">Ошибка сервера:</p>
              <pre className="whitespace-pre-wrap">
                {/* @ts-ignore */}
                {JSON.stringify((error as any).response?.data || error.message, null, 2)}
              </pre>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending || !selectedRole}
            className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Регистрация...
              </span>
            ) : (
              'Зарегистрироваться'
            )}
          </button>
        </form>

        {/* Login link */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Уже есть аккаунт?{' '}
          <Link to={paths.login} className="text-blue-600 font-medium hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  )
}
