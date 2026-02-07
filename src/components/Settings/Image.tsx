import Img from "../../assets/img/icons/Ondevelopment.svg"
const Image = () => {
  return (
    <div>
        <div className="flex flex-col justify-center items-center  mt-[60px] ml-[200px]">
            <img className="w-[100px] h-[100px]" src={Img} alt="" />
            <p className="text-[#635D5D] text-[38px] font-extrabold">В разработке. Скоро.</p>
        </div>

    </div>
  )
}

export default Image