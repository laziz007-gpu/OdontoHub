import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useLogin } from '../api/auth'
import type { LoginData } from '../interfaces'
import logo from '../assets/img/icons/Logo.svg'
import { paths } from '../Routes/path'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'

export default function Login() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { mutate: login, isPending, error } = useLogin()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginData>({
    defaultValues: {
      phone: '+998 '
    }
  })

  const phoneValue = watch('phone')

  // Следим за тем, чтобы префикс +998 всегда был на месте
  useEffect(() => {
    if (!phoneValue.startsWith('+998 ')) {
      setValue('phone', '+998 ')
    }
  }, [phoneValue, setValue])

  const onSubmit = (data: LoginData) => {
    // Чистим телефон от пробелов перед отправкой
    const cleanData = {
      phone: data.phone.replace(/\s+/g, ''),
    }

    login(cleanData, {
      onSuccess: () => {
        // Redirect based on user role from localStorage
        const role = localStorage.getItem('role')
        if (role === 'dentist') {
          navigate(paths.menu, { replace: true })
        } else {
          navigate(paths.patientHome, { replace: true })
        }
      },
      onError: (error: any) => {
        console.error('Login error:', error)
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-6">
        <img src={logo} alt="OdontoHub" className="w-20 h-20" />
      </div>

      <h1 className="text-3xl font-bold text-white mb-2">{t('auth.login_title')}</h1>
      <p className="text-white/70 mb-8">{t('auth.login_subtitle')}</p>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                // Не даем удалить префикс
                if (!val.startsWith('+998 ')) {
                  val = '+998 ';
                }

                // Форматируем ввод (можно добавить более сложную маску, но пока так)
                // Ограничиваем длину (префикс 5 символов + 9 цифр)
                if (val.replace(/\s+/g, '').length <= 13) {
                  setValue('phone', val);
                }
              }}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
            )}
          </div>

          {/* Error from server */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <p className="text-red-600 text-sm font-medium">
                {t('auth.error_user_not_found')}
              </p>
              <p className="text-red-500 text-xs mt-1">
                {t('auth.no_account')}{' '}
                <Link to={paths.registerPat} className="text-blue-600 font-medium hover:underline">
                  {t('auth.register_link')}
                </Link>
              </p>
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
                {t('auth.logging_in')}
              </span>
            ) : (
              t('auth.login_button')
            )}
          </button>
        </form>

        {/* Register link */}
        <p className="text-center text-gray-500 text-sm mt-6">
          {t('auth.no_account')}{' '}
          <Link to={paths.registerPat} className="text-blue-600 font-medium hover:underline">
            {t('auth.register_link')}
          </Link>
        </p>
      </div>
    </div>
  )
}
