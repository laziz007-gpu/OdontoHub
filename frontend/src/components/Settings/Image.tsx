import { useTranslation } from 'react-i18next';
import Img from "../../assets/img/icons/Ondevelopment.svg"

const Image = () => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="flex flex-col justify-center items-center  mt-[60px] ml-[200px]">
        <img className="w-[100px] h-[100px]" src={Img} alt="" />
        <p className="text-[#635D5D] text-[38px] font-extrabold">{t('settings.in_development')}</p>
      </div>

    </div>
  )
}

export default Image