import dentAuth from "../assets/img/photos/AuthImg.png";

interface AuthProps {
  children: React.ReactNode
}

export default function DentistAuth({children}: AuthProps) {
  return (
    <>
      <div className="">
        <img src={dentAuth} alt="" />
      </div>
      <div className="">
        {children}
      </div>
    </>
  )
}

