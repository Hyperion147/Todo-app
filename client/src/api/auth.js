import api from "./api";

export const register = async (userData) => {
    const response = await api.post("/auth/register", userData)
    return response.data
}
export const login = async (creadentials) => {
    const response = await api.post("/auth/login", creadentials)
    if(response.data.token){
        localStorage.setItem("token", response.data.token)
    }
    return response.data
}
export const logout = async () => {
    const response = await api.get("/auth/logout")
    localStorage.removeItem("token")
    return response.data
}