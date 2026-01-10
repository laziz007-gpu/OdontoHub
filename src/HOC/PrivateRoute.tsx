import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"

export default function PrivateRoute() {
  const access_token = localStorage.getItem('access_token')
  const navigate = useNavigate()

  const { data } = useCurrentUser()

  const { setUsers } = userStores
  useEffect(() => {
    if (!access_token) {
        navigate('/login')
    }
  }, [access_token])

  useEffect(() => {
    if (data) setUsers(data)
  }, [data])

  return <Outlet/>
}
