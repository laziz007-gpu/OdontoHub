import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setUser } from "../store/slices/userSlice"

interface PrivateRouteProps {
    requiredRole?: "dentist" | "patient"
}

export default function PrivateRoute({ requiredRole }: PrivateRouteProps) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [ready, setReady] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem("access_token")
        const userRaw = localStorage.getItem("user_data")

        if (!token || token === "null" || token === "undefined") {
            navigate("/login", { replace: true })
            return
        }

        if (!userRaw) {
            navigate("/login", { replace: true })
            return
        }

        try {
            const userData = JSON.parse(userRaw)
            dispatch(setUser(userData))

            if (requiredRole && userData.role !== requiredRole) {
                if (userData.role === "patient") {
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
