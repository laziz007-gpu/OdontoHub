import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"

export default function PublickRoute() {
   const accessToken = localStorage.getItem('access_token')
   const navigate = useNavigate()

   const isValidToken = accessToken && accessToken !== 'null' && accessToken !== 'undefined';

   useEffect(() => {
      if (isValidToken) {
         // Check user role and redirect accordingly
         const userData = localStorage.getItem('user_data')
         if (userData) {
            const user = JSON.parse(userData)
            if (user.role === 'patient') {
               navigate('/home', { replace: true })
            } else if (user.role === 'dentist') {
               navigate('/menu', { replace: true })
            } else {
               navigate('/role', { replace: true })
            }
         } else {
            navigate('/role', { replace: true })
         }
      }
   }, [isValidToken, navigate])

   return <Outlet />
}
