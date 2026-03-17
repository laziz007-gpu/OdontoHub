import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '../store/slices/userSlice'
import type { RegisterData, UserRole } from '../interfaces'
import { Stethoscope, User } from 'lucide-react'
import logo from '../assets/img/icons/Logo.svg'
import { paths } from '../Routes/path'
<<<<<<< HEAD
import { useTranslation } from 'react-i18next'

export default function Register1() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { mutate: registerUser, isPending, error } = useRegister()
=======
import { toast } from '../components/Shared/Toast'

export default function Register1() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
>>>>>>> 5a553df4cba3528c9d0f8757cfab166f5ee26e83
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Omit<RegisterData, 'role'>>({
    defaultValues: {
      phone: '+998 '
    }
  })

  const phoneValue = watch('phone')

  useEffect(() => {
    if (!phoneValue?.startsWith('+998 ')) {
      setValue('phone', '+998 ')
    }
  }, [phoneValue, setValue])

  const onSubmit = async (data: Omit<RegisterData, 'role'>) => {
    if (!selectedRole) return

    setIsLoading(true)

<<<<<<< HEAD
    registerUser(cleanData, {
      onSuccess: () => {
        // Redirect based on user role from localStorage
        const role = localStorage.getItem('role')
        if (role === 'dentist') {
          navigate(paths.menu, { replace: true })
        } else {
          navigate(paths.patientHome, { replace: true })
        }
      },
    })
=======
    try {
      // Check if we should use API or local mode
      const useAPI = import.meta.env.VITE_USE_API === 'true';

      if (useAPI) {
        // API mode - register via backend
        const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
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
        const meResponse = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
          headers: {
            'Authorization': `Bearer ${result.access_token}`
          }
        });
        
        if (meResponse.ok) {
          const userData = await meResponse.json();
          localStorage.setItem('user_data', JSON.stringify(userData));
          dispatch(setUser(userData));
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
          role: selectedRole
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
>>>>>>> 5a553df4cba3528c9d0f8757cfab166f5ee26e83
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 flex flex-col items-center justify-center px-4 py-8">
      {/* Logo */}
      <div className="mb-4">
        <img src={logo} alt="OdontoHub" className="w-16 h-16" />
      </div>

      <h1 className="text-3xl font-bold text-white mb-2">{t('auth.register_title')}</h1>
      <p className="text-white/70 mb-6">{t('auth.register_subtitle')}</p>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Role selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('auth.role_label')}
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
                <span className="text-sm font-medium">{t('auth.role_dentist')}</span>
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
                <span className="text-sm font-medium">{t('auth.role_patient')}</span>
              </button>
            </div>
            {!selectedRole && errors.full_name && (
              <p className="text-red-500 text-xs mt-1">{t('auth.error_role_required')}</p>
            )}
          </div>

          {/* Full name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('auth.full_name_label')}
            </label>
            <input
              type="text"
              placeholder={t('auth.full_name_placeholder')}
              className={`w-full px-4 py-3 rounded-xl border ${errors.full_name ? 'border-red-400' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
              {...register('full_name', {
                required: t('auth.error_name_required'),
                minLength: { value: 2, message: t('auth.error_name_min') },
              })}
            />
            {errors.full_name && (
              <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('auth.phone_label')}
            </label>
            <input
              type="tel"
              placeholder={t('auth.phone_placeholder')}
              className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-400' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
              {...register('phone', {
                required: t('auth.error_phone_required'),
                validate: (value) => {
                  const cleaned = value.replace(/\s+/g, '');
                  return /^\+998\d{9}$/.test(cleaned) || t('auth.error_phone_format');
                }
              })}
              onChange={(e) => {
                let val = e.target.value;
                if (!val.startsWith('+998 ')) {
                  val = '+998 ';
                }
                if (val.replace(/\s+/g, '').length <= 13) {
                  setValue('phone', val);
                }
              }}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
            )}
          </div>

          {/* Email (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('auth.email_label')} <span className="text-gray-400">{t('auth.email_optional')}</span>
            </label>
            <input
              type="email"
              placeholder="example@mail.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              {...register('email')}
            />
          </div>

<<<<<<< HEAD
          {/* Error from server */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <p className="text-red-600 text-sm font-medium">
                {/* @ts-ignore */}
                {(error as any).response?.data?.detail === "Phone already registered" 
                  ? t('auth.error_phone_registered')
                  : t('auth.error_registration')}
              </p>
              {/* @ts-ignore */}
              {(error as any).response?.data?.detail === "Phone already registered" && (
                <p className="text-red-500 text-xs mt-1">
                  {t('auth.have_account')}{' '}
                  <Link to={paths.login} className="text-blue-600 font-medium hover:underline">
                    {t('auth.login_link')}
                  </Link>
                </p>
              )}
            </div>
          )}

=======
>>>>>>> 5a553df4cba3528c9d0f8757cfab166f5ee26e83
          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !selectedRole}
            className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                {t('auth.registering')}
              </span>
            ) : (
              t('auth.register_button')
            )}
          </button>
        </form>

        {/* Login link */}
        <p className="text-center text-gray-500 text-sm mt-6">
          {t('auth.have_account')}{' '}
          <Link to={paths.login} className="text-blue-600 font-medium hover:underline">
            {t('auth.login_link')}
          </Link>
        </p>
      </div>
    </div>
  )
}
