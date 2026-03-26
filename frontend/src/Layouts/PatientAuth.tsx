import patientAuth from "../assets/img/photos/AuthImg2.png";

interface AuthProps {
  children: React.ReactNode
}

export default function PatientAuth({children}: AuthProps) {
  return (
    <>
        <div className="">
            <img src={patientAuth} alt="" />
        </div> 
        <div className="">
            {children}
        </div>
    </>
  )
}
