import { createContext, useContext, useEffect, useState } from 'react'
import { login as loginApi, logout as logoutApi } from "../api/auth"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            setUser({ token })
        }
        setLoading(false)
    }, [])

    const login = async (credentials) => {
        try {
            const data = await loginApi(credentials)
            setUser({ token: data.token })
            return data
        } catch (error) {
            throw error;
        }
    }

    const logout = async () => {
        try {
            await logoutApi()
            setUser(null)
            localStorage.removeItem("token")
        } catch (error) {
            throw error
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export default useAuth = () => {
    const context = useContext(AuthContext)
    if(context === undefined){
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
