import { createContext, useContext, useState, type ReactNode } from "react";

type User = { username: string };

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        try {
            const raw = localStorage.getItem("auth:user");
            return raw ? (JSON.parse(raw) as User) : null;
        } catch {
            return null;
        }
    });

    const login = (username: string, password: string) => {
        // Login básico de exemplo. Substitua por chamada à API quando necessário.
        if (username === 'admin' && password === 'senha') {
            const logged: User = { username: 'Admin' };
            setUser(logged);
            try { localStorage.setItem("auth:user", JSON.stringify(logged)); } catch (err) { console.warn('Auth storage set error', err); }
            return true;
        }
        return false;
    };
    
    const logout = () => {
        setUser(null);
    try { localStorage.removeItem("auth:user"); } catch (err) { console.warn('Auth storage clear error', err); }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: Boolean(user),
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    return ctx;
};

