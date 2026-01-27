import Doshboard from "./Doshboard"

interface UserProps {
  children: React.ReactNode
}

export default function userInterface({children}: UserProps) {
  return (
    <>
      <div className="">
        <Doshboard/>
      </div>
      <div className="">
        {children}
      </div>
    </>
  )
}
