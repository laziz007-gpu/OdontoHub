import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setUser } from "../store/slices/userSlice"
import { getUser, getUserRole, isAuthenticated } from "../utils/auth"

interface PrivateRouteProps {
    requiredRole?: "dentist" | "patient"
}

export default function PrivateRoute({ requiredRole }: PrivateRouteProps) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [ready, setReady] = useState(false)

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate("/login", { replace: true })
            return
        }

        const role = getUserRole()
        const userData = getUser()

        if (!role) {
            navigate("/login", { replace: true })
            return
        }

        try {
            if (userData) {
                const normalizedUser = userData.role === role ? userData : { ...userData, role }
                if (normalizedUser !== userData) {
                    localStorage.setItem("user_data", JSON.stringify(normalizedUser))
                }
                dispatch(setUser(normalizedUser))
            }

            if (requiredRole && role !== requiredRole) {
                if (role === "patient") {
                    navigate("/home", { replace: true })
                } else {
                    navigate("/menu", { replace: true })
                }
                return
            }

            setReady(true)
        } catch {
            navigate("/login", { replace: true })
        }
    }, [])

    if (!ready) return null

    return <Outlet />
}
