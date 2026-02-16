import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"

export default function PublickRoute() {
   const accessToken = localStorage.getItem('access_token')
   const navigate = useNavigate()

   const isValidToken = accessToken && accessToken !== 'null' && accessToken !== 'undefined';

   useEffect(() => {
      if (isValidToken) {
         navigate('/role', { replace: true })
      }
   }, [isValidToken, navigate])

   return <Outlet />
}
