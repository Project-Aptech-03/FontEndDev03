import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import {AuthUser} from "../@type/login";

interface AuthContextType {
    isLoggedIn: boolean;
    user: AuthUser | null;
    login: (response: AuthUser, rememberMe?: boolean) => void;
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
        const savedUser = localStorage.getItem("user") || sessionStorage.getItem("user");

        if (token && savedUser) {
            try {
                const parsed: AuthUser = JSON.parse(savedUser);
                if (parsed?.token === token) {
                    setUser(parsed);
                    setIsLoggedIn(true);
                }
            } catch {
                setUser(null);
                setIsLoggedIn(false);
            }
        }
        setLoading(false);
    }, []);

    const login = (response: AuthUser, rememberMe: boolean = true) => {
        if (rememberMe) {
            localStorage.setItem("accessToken", response.token);
            localStorage.setItem("user", JSON.stringify(response));
        } else {
            sessionStorage.setItem("accessToken", response.token);
            sessionStorage.setItem("user", JSON.stringify(response));
        }
        setIsLoggedIn(true);
        setUser(response);
    };

    const logout = () => {
        localStorage.clear();
        sessionStorage.clear();
        setIsLoggedIn(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
