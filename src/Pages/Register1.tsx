import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '../store/slices/userSlice'
import type { RegisterData, UserRole } from '../interfaces'
import { Stethoscope, User } from 'lucide-react'
import logo from '../assets/img/icons/Logo.svg'
import { paths } from '../Routes/path'
import { toast } from '../components/Shared/Toast'

export default function Register1() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<RegisterData, 'role'>>()

  const onSubmit = async (data: Omit<RegisterData, 'role'>) => {
    if (!selectedRole) return

    setIsLoading(true)

    try {
      // Check if we should use API or local mode
      const useAPI = import.meta.env.VITE_USE_API === 'true';

      if (useAPI) {
        // API mode - register via backend
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            full_name: data.full_name,
            phone: data.phone.replace(/\s+/g, ''),
            email: data.email || '',
            role: selectedRole
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.detail || 'Registration failed');
        }

        const result = await response.json();
        
        // Save token and user data
        localStorage.setItem('access_token', result.access_token);
        
        // Fetch user profile
        const meResponse = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${result.access_token}`
          }
        });
        
        if (meResponse.ok) {
          const userData = await meResponse.json();
          localStorage.setItem('user_data', JSON.stringify(userData));
          dispatch(setUser(userData));
        } else {
          // fallback: build user data from what we know
          const fallbackUser = {
            full_name: data.full_name,
            phone: data.phone.replace(/\s+/g, ''),
            role: selectedRole,
          };
          localStorage.setItem('user_data', JSON.stringify(fallbackUser));
          dispatch(setUser(fallbackUser));
        }

        setIsLoading(false);
        
        // Navigate based on role
        if (selectedRole === 'patient') {
          localStorage.setItem('is_first_time', 'true');
          navigate(paths.doctors, { replace: true });
        } else {
          navigate(paths.menu, { replace: true });
        }
        
      } else {
        // Local mode - save to localStorage
        const userData = {
          full_name: data.full_name,
          phone: data.phone.replace(/\s+/g, ''),
          email: data.email || '',
          role: selectedRole,
          // For dentist local mode, assign dentist_id based on name match or default to 2
          ...(selectedRole === 'dentist' && { dentist_id: 2 })
        }

        // Save user data to localStorage
        localStorage.setItem('user_data', JSON.stringify(userData))
        localStorage.setItem('access_token', 'local_token_' + Date.now())

        // Save to Redux store
        dispatch(setUser(userData))

        // Add demo appointments for patient
        if (selectedRole === 'patient') {
          const today = new Date();
          const demoAppointments = [
            // Past appointments
            {
              id: Date.now() - 3,
              doctor_id: 2,
              doctor_name: "Махмуд Пулатов",
              service: "Осмотр",
              date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU'),
              time: "10:00",
              status: "past",
              comment: "Прошёл успешно",
              created_at: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: Date.now() - 2,
              doctor_id: 2,
              doctor_name: "Махмуд Пулатов",
              service: "Пломбирование",
              date: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU'),
              time: "14:30",
              status: "past",
              comment: "Завершено",
              created_at: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: Date.now() - 1,
              doctor_id: 2,
              doctor_name: "Махмуд Пулатов",
              service: "Консультация",
              date: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU'),
              time: "11:00",
              status: "past",
              comment: "",
              created_at: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
            }
          ];
          localStorage.setItem('appointments', JSON.stringify(demoAppointments));
          
          // Mark as first time user
          localStorage.setItem('is_first_time', 'true');
        }

        setIsLoading(false);
        
        // Navigate based on role
        if (selectedRole === 'patient') {
          navigate(paths.doctors, { replace: true });
        } else {
          navigate(paths.menu, { replace: true });
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Registration error:', error);
      toast.error(error instanceof Error ? error.message : 'Ошибка регистрации');
    }
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

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !selectedRole}
            className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
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
