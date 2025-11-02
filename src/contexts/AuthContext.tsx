import { createContext, useContext, useState, type ReactNode } from "react";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const login = (user: string, password: string) => {
        if (user === 'admin' && password === 'password') {
            setUser({ username: 'Admin' });
            return true;
        }
        return false;
    }
    
    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

