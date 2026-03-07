import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"

export default function PublickRoute() {
   const accessToken = localStorage.getItem('access_token')
   const role = localStorage.getItem('role')
   const navigate = useNavigate()

   const isValidToken = accessToken && accessToken !== 'null' && accessToken !== 'undefined';

   useEffect(() => {
      if (isValidToken && role) {
         // Redirect to appropriate dashboard based on role
         if (role === 'dentist') {
            navigate('/menu', { replace: true })
         } else {
            navigate('/home', { replace: true })
         }
      }
   }, [isValidToken, role, navigate])

   return <Outlet />
}
