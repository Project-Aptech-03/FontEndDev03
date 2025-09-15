import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { User } from "../@type/UserResponseDto";

interface AuthContextType {
    isLoggedIn: boolean;
    user: User | null;
    login: (token: string, user: User, rememberMe?: boolean) => void;
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
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
        const savedUser = localStorage.getItem("user") || sessionStorage.getItem("user");

        if (token && savedUser && savedUser !== "undefined" && savedUser !== "false") {
            try {
                const parsed = JSON.parse(savedUser);
                // đảm bảo parsed phải là object
                if (parsed && typeof parsed === "object" && "role" in parsed) {
                    setUser(parsed);
                    setIsLoggedIn(true);
                } else {
                    setUser(null);
                    setIsLoggedIn(false);
                }
            } catch {
                setUser(null);
                setIsLoggedIn(false);
            }
        }
        setLoading(false);
    }, []);

    const login = (token: string, user: User, rememberMe: boolean = true) => {
        if (rememberMe) {
            localStorage.setItem("accessToken", token);
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            sessionStorage.setItem("accessToken", token);
            sessionStorage.setItem("user", JSON.stringify(user));
        }
        setIsLoggedIn(true);
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("user");
        setIsLoggedIn(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
