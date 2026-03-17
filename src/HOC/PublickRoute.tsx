import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"

export default function PublickRoute() {
   const accessToken = localStorage.getItem('access_token')
   const role = localStorage.getItem('role')
   const navigate = useNavigate()

   const isValidToken = accessToken && accessToken !== 'null' && accessToken !== 'undefined';

   useEffect(() => {
<<<<<<< HEAD
      if (isValidToken && role) {
         // Redirect to appropriate dashboard based on role
         if (role === 'dentist') {
            navigate('/menu', { replace: true })
         } else {
            navigate('/home', { replace: true })
=======
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
>>>>>>> 5a553df4cba3528c9d0f8757cfab166f5ee26e83
         }
      }
   }, [isValidToken, role, navigate])

   return <Outlet />
}
