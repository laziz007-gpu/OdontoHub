import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useRegister } from '../api/auth'
import type { RegisterData, UserRole } from '../interfaces'
import { Stethoscope, User } from 'lucide-react'
import logo from '../assets/img/icons/Logo.svg'
import { paths } from '../Routes/path'
import { useTranslation } from 'react-i18next'

export default function Register1() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { mutate: registerUser, isPending, error } = useRegister()
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)

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

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending || !selectedRole}
            className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
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
