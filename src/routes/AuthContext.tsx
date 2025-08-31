import {createContext, useState, ReactNode, useContext} from "react";
import {User} from "../@type/UserResponseDto";

interface AuthContextType {
    isLoggedIn: boolean;
    user: User | null;  // thêm user
    login: (token: string, user: User) => void; // truyền cả token + user
    logout: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
        !!localStorage.getItem("accessToken")
    );
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem("user");
        if (!savedUser || savedUser === "undefined") return null;
        try {
            return JSON.parse(savedUser) as User;
        } catch {
            return null;
        }
    });


    const login = (token: string, user: User) => {
        localStorage.setItem("accessToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        setIsLoggedIn(true);
        setUser(user);
    };
    
    

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
