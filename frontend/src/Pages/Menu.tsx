import DoctorPageShell from '../components/Layout/DoctorPageShell'
import Render from './Render'

const Menu = () => {
  return (
    <DoctorPageShell
      badge="Dashboard"
      title="GoSmile"
      accent="Рабочее пространство"
      description="Главный экран врача с быстрым доступом к пациентам, аналитике, уведомлениям и ежедневным задачам."
      contentClassName="p-0"
    >
      <Render />
    </DoctorPageShell>
  )
}

export default Menu
