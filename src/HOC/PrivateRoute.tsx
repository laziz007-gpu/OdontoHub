import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useCurrentUser } from "../api/auth"

export default function PrivateRoute() {
  const access_token = localStorage.getItem('access_token')
  const navigate = useNavigate()

  const { data } = useCurrentUser()

  const { setUsers } = userStores
  useEffect(() => {
    if (!access_token) {
      navigate('/login')
    }
  }, [access_token, navigate])

  useEffect(() => {
    if (data) setUsers(data)
  }, [data, setUsers])

  return <Outlet/>
}
