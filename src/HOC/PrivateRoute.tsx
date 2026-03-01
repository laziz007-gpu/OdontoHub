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

    // Check if using local token (starts with 'local_token_')
    const isLocalMode = accessToken?.startsWith('local_token_')

    // Only use API if not in local mode
    const { data: userFromApi, isLoading, isError } = useCurrentUser()

    useEffect(() => {
        // Strict redirection if no token is found in localStorage
        if (!accessToken || accessToken === 'null' || accessToken === 'undefined') {
            navigate('/login', { replace: true })
            return
        }

        // If local mode and no user in Redux, load from localStorage
        if (isLocalMode && !userFromState) {
            const userData = localStorage.getItem('user_data')
            if (userData) {
                dispatch(setUser(JSON.parse(userData)))
            }
        }
    }, [accessToken, navigate, isLocalMode, userFromState, dispatch])

    useEffect(() => {
        // Only update from API if not in local mode
        if (!isLocalMode && userFromApi) {
            dispatch(setUser(userFromApi))
        }
    }, [userFromApi, dispatch, isLocalMode])

    // Role check logic
    useEffect(() => {
        if (requiredRole && userFromState && userFromState.role !== requiredRole) {
            navigate('/role', { replace: true })
        }
    }, [requiredRole, userFromState, navigate])

    // 1. If no token, don't render anything (redirect will happen in useEffect)
    if (!accessToken || accessToken === 'null' || accessToken === 'undefined') return null

    // 2. If local mode, check if user is in Redux state
    if (isLocalMode) {
        if (!userFromState) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
                </div>
            )
        }
        
        // Role check for local mode
        if (requiredRole && userFromState.role !== requiredRole) {
            return null
        }
        
        return <Outlet />
    }

    // 3. API mode - If we have a token but no user in state and query is still loading
    if (isLoading && !userFromState) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
            </div>
        )
    }

    // 4. If loading finished but role mismatch (wait for useEffect redirect)
    if (requiredRole && userFromState && userFromState.role !== requiredRole) {
        return null
    }

    // 5. If loading finished with error or no user data found (invalid session)
    if (!isLoading && !userFromApi && !userFromState && !isError) {
        // This case might happen briefly before the 401 interceptor kicks in
        return null
    }

    return <Outlet />
}
