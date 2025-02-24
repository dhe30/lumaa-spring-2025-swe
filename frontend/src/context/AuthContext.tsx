import { createContext, useEffect, useState } from "react";
import api from "../api/api";
import { AxiosError } from "axios";
interface AuthContextType {
    user: string | null; 
    login: (username: string, password: string) => Promise<{success: boolean, message?: string}>;
    register: (username: string, password: string) => Promise<{success: boolean, message?: string}>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: {children: React.ReactNode}) => {
    const [user, setUser] = useState(() => {
        const cachedUser = localStorage.getItem("user");
        return cachedUser? JSON.parse(cachedUser).username : null
    });

    useEffect(() => {
        if (!user) {
            api.get("/auth/profile")
            .then(res => setUser(res.data))
            .catch(() => setUser(null))
        }
    },[])

    const login = async (username: string, password: string) => {
        try {
            const res = await api.post("/auth/login", { username, password });
            setUser(res.data.username)
            localStorage.setItem("user", JSON.stringify(res.data))
            return { success: true }
        } catch(error) {
            if (error instanceof AxiosError) {
                return { success: false, message: error.response?.data?.message || "login failed"}
            } else {
                return { success: false, message: "An unexpected error occurred" };
            }
        }
    }

    const register = async (username: string, password: string) => {
        try {
            const res = await api.post("/auth/register", { username, password });
            setUser(res.data.username);
            localStorage.setItem("user", JSON.stringify(res.data));
            return { success: true }
        } catch(error) {
            if (error instanceof AxiosError) {
                return { success: false, message: error.response?.data?.message || "login failed"}
            } else {
                return { success: false, message: "An unexpected error occurred" };
            }
        }
    }

    const logout = async () => {
        try {
            await api.post("/auth/logout");
            localStorage.removeItem("user")
            setUser(null)
        } catch(error) {
            console.error("Logout failed:", error);
        }
    }
    return <AuthContext.Provider value={{user, register, login, logout}}>{children}</AuthContext.Provider>
}