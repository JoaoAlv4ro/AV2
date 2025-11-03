/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, useCallback, type ReactNode } from 'react';

// Evita depender do enum global com erros; usamos union string local
export const nivelPermissaoValores = [
  'Administrador',
  'Engenheiro',
  'Operador',
] as const;
export type NivelPermissao = typeof nivelPermissaoValores[number];

export interface Funcionario {
  id: string;
  nome: string;
  telefone: string;
  endereco: string;
  usuario: string;
  senha: string;
  nivelPermissao: NivelPermissao;
}

interface FuncionarioContextType {
  funcionarios: Funcionario[];
  loading: boolean;
  error: string | null;
  createFuncionario: (data: Omit<Funcionario, 'id'>) => Promise<void>;
  updateFuncionario: (id: string, data: Partial<Omit<Funcionario, 'id'>>) => Promise<void>;
  deleteFuncionario: (id: string) => Promise<void>;
}

const FuncionarioContext = createContext<FuncionarioContextType | undefined>(undefined);

const STORAGE_KEY = 'data:funcionarios';

function loadInitial(): Funcionario[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Funcionario[];
  } catch (err) {
    console.warn('Funcionario storage load error', err);
  }
  // Mock inicial
  return [
    {
      id: crypto?.randomUUID ? crypto.randomUUID() : '1',
      nome: 'João Silva',
      telefone: '(11) 98888-7777',
      endereco: 'Rua A, 123',
      usuario: 'joaos',
      senha: '123456',
      nivelPermissao: 'Engenheiro',
    },
    {
      id: crypto?.randomUUID ? crypto.randomUUID() : '2',
      nome: 'Maria Souza',
      telefone: '(21) 97777-8888',
      endereco: 'Av. Central, 456',
      usuario: 'marias',
      senha: 'abcdef',
      nivelPermissao: 'Operador',
    },
  ];
}

export function FuncionarioProvider({ children }: { children: ReactNode }) {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(loadInitial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const persist = useCallback((list: Funcionario[]) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }
    catch (e) { console.warn('Funcionario storage save error', e); }
  }, []);

  const createFuncionario = useCallback(async (data: Omit<Funcionario, 'id'>) => {
    setLoading(true);
    try {
      const novo: Funcionario = {
        ...data,
        id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
      };
      setFuncionarios(prev => {
        const next = [...prev, novo];
        persist(next);
        return next;
      });
      setError(null);
    } catch (e) {
      setError('Erro ao criar funcionário');
      console.warn(e);
    } finally {
      setLoading(false);
    }
  }, [persist]);

  const updateFuncionario = useCallback(async (id: string, data: Partial<Omit<Funcionario, 'id'>>) => {
    setLoading(true);
    try {
      setFuncionarios(prev => {
        const next = prev.map(f => f.id === id ? { ...f, ...data } : f);
        persist(next);
        return next;
      });
      setError(null);
    } catch (e) {
      setError('Erro ao atualizar funcionário');
      console.warn(e);
    } finally {
      setLoading(false);
    }
  }, [persist]);

  const deleteFuncionario = useCallback(async (id: string) => {
    setLoading(true);
    try {
      setFuncionarios(prev => {
        const next = prev.filter(f => f.id !== id);
        persist(next);
        return next;
      });
      setError(null);
    } catch (e) {
      setError('Erro ao remover funcionário');
      console.warn(e);
    } finally {
      setLoading(false);
    }
  }, [persist]);

  const value: FuncionarioContextType = useMemo(() => ({
    funcionarios,
    loading,
    error,
    createFuncionario,
    updateFuncionario,
    deleteFuncionario,
  }), [funcionarios, loading, error, createFuncionario, updateFuncionario, deleteFuncionario]);

  return (
    <FuncionarioContext.Provider value={value}>
      {children}
    </FuncionarioContext.Provider>
  );
}

export function useFuncionarios() {
  const ctx = useContext(FuncionarioContext);
  if (!ctx) throw new Error('useFuncionarios deve ser usado dentro de FuncionarioProvider');
  return ctx;
}
