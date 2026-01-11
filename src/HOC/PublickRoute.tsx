import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"


export default function PublickRoute() {
   const access_token = localStorage.getItem('access_token')
   const navigate = useNavigate()

   useEffect(() => {
     if (access_token) {
        navigate('')
     }
   }, [access_token, navigate])
   return <Outlet/>
}
