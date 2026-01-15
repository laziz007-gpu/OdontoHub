import AuthImg from "../assets/img/photos/AuthImg.png";

interface RegisterProps {
  children: React.ReactNode
}

export default function RegisterLayouts() {
  return (
    <>
      <div className="">
        <div className="">
          <img src={AuthImg} alt="" />
        </div>
      </div>
    </>
  )
}
