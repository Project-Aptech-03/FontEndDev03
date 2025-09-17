import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthUser } from "../@type/login";
import apiClient from "../services/api";

interface AuthContextType {
    isLoggedIn: boolean;
    user: AuthUser | null;
    login: (user: AuthUser, rememberMe?: boolean) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
        if (token) {
            apiClient.get("/auth/me")
                .then(res => {
                    const userData: AuthUser = {
                        id: res.data.data.userId,
                        email: res.data.data.email,
                        fullName: res.data.data.fullName,
                        role: res.data.data.role,
                        token: token,
                    };
                    setUser(userData);
                    setIsLoggedIn(true);
                })
                .catch(() => logout())
                .finally(() => setLoading(false));
        } else setLoading(false);
    }, []);

    const login = (userData: AuthUser, rememberMe: boolean = true) => {
        if (rememberMe) {
            localStorage.setItem("accessToken", userData.token);
            localStorage.setItem("refreshToken", userData.refreshToken ?? "");
            localStorage.setItem("user", JSON.stringify(userData));
        } else {
            sessionStorage.setItem("accessToken", userData.token);
            sessionStorage.setItem("refreshToken", userData.refreshToken ?? "");
            sessionStorage.setItem("user", JSON.stringify(userData));
        }
        setUser(userData);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.clear();
        sessionStorage.clear();
        setUser(null);
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
