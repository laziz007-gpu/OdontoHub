import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { getUserRole, isAuthenticated } from "../utils/auth"

export default function PublickRoute() {
   const navigate = useNavigate()

   useEffect(() => {
      if (isAuthenticated()) {
         const role = getUserRole()
         if (role === 'patient') {
            navigate('/home', { replace: true })
         } else if (role === 'dentist') {
            navigate('/menu', { replace: true })
         } else {
            navigate('/role', { replace: true })
         }
      }
   }, [navigate])

   return <Outlet />
}
