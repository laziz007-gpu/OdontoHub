import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useCurrentUser } from "../api/auth"
import { useDispatch, useSelector } from "react-redux"
import { setUser } from "../store/slices/userSlice"
import type { RootState } from "../store/store"

interface PrivateRouteProps {
    requiredRole?: 'dentist' | 'patient'
}

export default function PrivateRoute({ requiredRole }: PrivateRouteProps) {
    const accessToken = localStorage.getItem('access_token')
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userFromState = useSelector((state: RootState) => state.user.user)

    // Disable query if no token
    const { data: userFromApi, isLoading, isError } = useCurrentUser()

    useEffect(() => {
        // Strict redirection if no token is found in localStorage
        if (!accessToken || accessToken === 'null' || accessToken === 'undefined') {
            navigate('/login', { replace: true })
        }
    }, [accessToken, navigate])

    useEffect(() => {
        if (userFromApi) {
            dispatch(setUser(userFromApi))
        }
    }, [userFromApi, dispatch])

    // Role check logic
    useEffect(() => {
        if (requiredRole && userFromState && userFromState.role !== requiredRole) {
            navigate('/role', { replace: true })
        }
    }, [requiredRole, userFromState, navigate])

    // 1. If no token, don't render anything (redirect will happen in useEffect)
    if (!accessToken || accessToken === 'null' || accessToken === 'undefined') return null

    // 2. If we have a token but no user in state and query is still loading
    if (isLoading && !userFromState) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
            </div>
        )
    }

    // 3. If loading finished but role mismatch (wait for useEffect redirect)
    if (requiredRole && userFromState && userFromState.role !== requiredRole) {
        return null
    }

    // 4. If loading finished with error or no user data found (invalid session)
    if (!isLoading && !userFromApi && !userFromState && !isError) {
        // This case might happen briefly before the 401 interceptor kicks in
        return null
    }

    return <Outlet />
}
