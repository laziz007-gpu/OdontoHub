import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/img/icons/Logo.svg'
import { paths } from '../Routes/path'

interface DoctorProfileData {
  age: number
  specialization: string
  experience_years: number
  address: string
  clinic_name: string
}

export default function DoctorProfileSetup() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DoctorProfileData>()

  const onSubmit = async (data: DoctorProfileData) => {
    setIsSubmitting(true)
    
    try {
      // TODO: Send data to backend API
      console.log('Doctor profile data:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Navigate to dashboard
      navigate(paths.menu, { replace: true })
    } catch (error) {
      console.error('Failed to save profile:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 flex flex-col items-center justify-center px-4 py-8">
      {/* Logo */}
      <div className="mb-4">
        <img src={logo} alt="OdontoHub" className="w-16 h-16" />
      </div>

      <h1 className="text-3xl font-bold text-white mb-2">Заполните профиль</h1>
      <p className="text-white/70 mb-6">Расскажите о себе</p>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Возраст
            </label>
            <input
              type="number"
              placeholder="Например: 35"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.age ? 'border-red-400' : 'border-gray-200'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
              {...register('age', {
                required: 'Введите возраст',
                min: { value: 18, message: 'Минимальный возраст 18 лет' },
                max: { value: 100, message: 'Максимальный возраст 100 лет' },
              })}
            />
            {errors.age && (
              <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>
            )}
          </div>

          {/* Specialization */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Специализация
            </label>
            <select
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.specialization ? 'border-red-400' : 'border-gray-200'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white`}
              {...register('specialization', {
                required: 'Выберите специализацию',
              })}
            >
              <option value="">Выберите специализацию</option>
              <option value="general">Общий профильный</option>
              <option value="surgeon">Хирург</option>
              <option value="therapist">Терапевт</option>
              <option value="orthodontist">Ортодонт</option>
              <option value="orthopedist">Ортопед</option>
              <option value="periodontist">Пародонтолог</option>
              <option value="implantologist">Имплантолог</option>
              <option value="hygienist">Гигиенист</option>
              <option value="aesthetician">Эстетик</option>
            </select>
            {errors.specialization && (
              <p className="text-red-500 text-xs mt-1">{errors.specialization.message}</p>
            )}
          </div>

          {/* Experience Years */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Стаж работы (лет)
            </label>
            <input
              type="number"
              placeholder="Например: 10"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.experience_years ? 'border-red-400' : 'border-gray-200'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
              {...register('experience_years', {
                required: 'Введите стаж работы',
                min: { value: 0, message: 'Минимальный стаж 0 лет' },
                max: { value: 80, message: 'Максимальный стаж 80 лет' },
              })}
            />
            {errors.experience_years && (
              <p className="text-red-500 text-xs mt-1">{errors.experience_years.message}</p>
            )}
          </div>

          {/* Clinic Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Название клиники
            </label>
            <input
              type="text"
              placeholder="Например: Стоматология Улыбка"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.clinic_name ? 'border-red-400' : 'border-gray-200'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
              {...register('clinic_name', {
                required: 'Введите название клиники',
                minLength: { value: 2, message: 'Минимум 2 символа' },
              })}
            />
            {errors.clinic_name && (
              <p className="text-red-500 text-xs mt-1">{errors.clinic_name.message}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Адрес клиники
            </label>
            <textarea
              placeholder="Например: г. Ташкент, ул. Амира Темура, 15"
              rows={3}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.address ? 'border-red-400' : 'border-gray-200'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none`}
              {...register('address', {
                required: 'Введите адрес',
                minLength: { value: 5, message: 'Минимум 5 символов' },
              })}
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Сохранение...
              </span>
            ) : (
              'Продолжить'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
