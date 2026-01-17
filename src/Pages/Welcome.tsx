import logo from "../assets/img/icons/Logo.svg"
import welcomeImg from "../assets/img/photos/WelcomeImg.png"

export default function Welcome() {
  return (
    <>
      <div className="">
        <div className="relative min-h-screen overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${welcomeImg})` }}></div>
        </div>
        <div className="
          
        ">
          <img src={logo} alt="" />
        </div>
      </div>
    </>
  )
}
