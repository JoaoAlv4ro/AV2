/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, useCallback, type ReactNode, useEffect } from 'react';
import type { Funcionario } from '../../types';
import { loadDomainData } from '../../services/mockApi';

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
  // Sem storage, inicia vazio e carrega do mock via useEffect
  return [];
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

  // Carrega do mock-json apenas se não existir nada no localStorage
  useEffect(() => {
    if (funcionarios.length > 0) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { funcionarios: loaded } = await loadDomainData();
        if (!cancelled) {
          setFuncionarios(loaded);
          persist(loaded);
          setError(null);
        }
      } catch (e) {
        console.warn(e);
        if (!cancelled) setError('Erro ao carregar funcionários');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
