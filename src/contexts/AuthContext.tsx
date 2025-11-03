import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { loadDomainData } from '../services/mockApi'
import type { Funcionario } from '../types'
import { NivelPermissao } from '../types/enums'

type AuthUser = Pick<Funcionario, "id" | "nome" | "usuario" | "nivelPermissao">;

interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean; 
    loading: boolean;
    error: string | null;
    login: (usuario: string, senha: string, opts?: {remember?: boolean}) => Promise<boolean>;
    logout: () => void;
    hasRole: (...permissao: NivelPermissao[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Persistencia de login
const STORAGE_USER = "auth:user"; // Chave do user que será salva no localStorage
const STORAGE_EXP = "auth:exp"; // Armazenamento de Data e hora do login
const DEFAULT_TTL_MS = 1000 * 60 * 60 * 8; // Tempo de sessão (8 horas)

function readStoredUser(): AuthUser | null {
    try {
        const raw = localStorage.getItem(STORAGE_USER);
        return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
        return null
    }
}

function readStoredExp(): number | null {
    try {
        const raw = localStorage.getItem(STORAGE_EXP);
        return raw ? Number(raw): null;
    } catch {
        return null;
    }
}

function isExpired(exp: number | null): boolean {
    return exp != null && Date.now() > exp;
}

function clearStorage() {
    try {
        localStorage.removeItem(STORAGE_USER);
        localStorage.removeItem(STORAGE_EXP);
    } catch (err) {
        console.warn("clearStorage() auth error:", err);
    }
}

function saveSession(user: AuthUser, ttlMs: number) {
    try {
        localStorage.setItem(STORAGE_USER, JSON.stringify(user));
        localStorage.setItem(STORAGE_EXP, String(Date.now() + ttlMs));
    } catch (err) {
        console.warn("saveSession() auth set error:", err);
    }
}

export const AuthProvider = ({ children }: {children: ReactNode}) => {
    // Inicializa conta
    const initialUser = (() => {
        const u = readStoredUser();
        const exp = readStoredExp();
        if (isExpired(exp)) {
            clearStorage();
            return null;
        }
        return u;
    })();

    const [user, setUser] = useState<AuthUser | null>(initialUser);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Verificação periódica de expiração de sessão (TTL)
    useEffect(() => {
        const iv = setInterval(() => {
            const exp = readStoredExp();
            if (isExpired(exp)) {
                clearStorage();
                setUser(null);
            }
        }, 30_000);
        return () => clearInterval(iv);
    }, []);

    const login: AuthContextType["login"] = async (usuario, senha, opts) => {
        setError(null);
        setLoading(true);

        try {
            // Credencial especial de desenvolvimento (não interfere no mock-data)
            if (usuario === 'dev' && senha === 'dev') {
                const authUser: AuthUser = {
                    id: 'DEV',
                    nome: 'Admin Dev',
                    usuario: 'dev',
                    nivelPermissao: NivelPermissao.ADMINISTRADOR,
                };
                const ttl = opts?.remember ? 1000 * 60 * 60 * 24 * 30 : DEFAULT_TTL_MS;
                saveSession(authUser, ttl);
                setUser(authUser);
                setError(null);
                return true;
            }

            // Carrega do mock (Depois será feito um endpoint da API backend)
            const { funcionarios } = await loadDomainData();

            const userFound = funcionarios.find(
                (f) => f.usuario === usuario && f.senha === senha
            );

            if (!userFound) {
                setError("Usuário ou senha incorretos");
                return false;
            }

            const authUser: AuthUser = {
                id: userFound.id,
                nome: userFound.nome,
                usuario: userFound.usuario,
                nivelPermissao: userFound.nivelPermissao,
            };

            const ttl = opts?.remember ? 1000 * 60 * 60 * 24 * 30 : DEFAULT_TTL_MS;
            saveSession(authUser, ttl);

            setUser(authUser);
            setError(null);
            return true;
        } catch (e) {
            console.warn(e);
            setError("Usuário ou senha incorretos");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        clearStorage();
    }

    const hasRole = (...roles: NivelPermissao[]) => {
        if (!user) return false;
        return roles.includes(user.nivelPermissao)
    }

    const value: AuthContextType = {
        user,
        isAuthenticated: Boolean(user),
        loading,
        error,
        login,
        logout,
        hasRole,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    return ctx;
};