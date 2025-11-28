/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { TipoAeronave } from '../../types/enums';
import type { Aeronave, AeronaveFormData } from '../../types/index';
import { aeronavesService } from '../../services/aeronavesService';

interface AeronaveContextType {
  aeronaves: Aeronave[];
  loading: boolean;
  error: string | null;
  
  // CRUD Operations
  getAeronaveById: (codigo: string) => Aeronave | undefined;
  createAeronave: (data: AeronaveFormData) => Promise<void>;
  updateAeronave: (codigo: string, data: Partial<AeronaveFormData>) => Promise<void>;
  deleteAeronave: (codigo: string) => Promise<void>;
  // Local state updates (no API calls)
  patchAeronaveLocal: (codigo: string, data: Partial<Aeronave>) => void;
  
  // Statistics
  getTotalAeronaves: () => number;
  getAeronavesByTipo: (tipo: TipoAeronave) => Aeronave[];
}

const AeronaveContext = createContext<AeronaveContextType | undefined>(undefined);

// Agora os dados são carregados do mock JSON via serviço

export function AeronaveProvider({ children }: { children: ReactNode }) {
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const listaAeronaves = await aeronavesService.list();
        if (!cancelled) {
          setAeronaves(listaAeronaves);
          setError(null);
        }
      } catch (e) {
        console.warn(e);
        if (!cancelled) setError('Erro ao carregar aeronaves');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const getAeronaveById = (codigo: string): Aeronave | undefined => {
    return aeronaves.find(aeronave => aeronave.codigo === codigo);
  };

  const createAeronave = async (data: AeronaveFormData): Promise<void> => {
    setLoading(true);
    try {
      const created = await aeronavesService.create(data);
      setAeronaves(prev => [...prev, created]);
      setError(null);
    } catch (e) {
      console.warn(e);
      setError('Erro ao criar aeronave');
    } finally {
      setLoading(false);
    }
  };

  const updateAeronave = async (codigo: string, data: Partial<AeronaveFormData>): Promise<void> => {
    setLoading(true);
    try {
      const updated = await aeronavesService.update(codigo, data);
      setAeronaves(prev => prev.map(a => a.codigo === codigo ? updated : a));
      setError(null);
    } catch (e) {
      console.warn(e);
      setError('Erro ao atualizar aeronave');
    } finally {
      setLoading(false);
    }
  };

  const deleteAeronave = async (codigo: string): Promise<void> => {
    setLoading(true);
    try {
      await aeronavesService.delete(codigo);
      setAeronaves(prev => prev.filter(a => a.codigo !== codigo));
      setError(null);
    } catch (e) {
      console.warn(e);
      setError('Erro ao deletar aeronave');
    } finally {
      setLoading(false);
    }
  };

  // Atualiza somente o estado local, sem chamar a API
  const patchAeronaveLocal = (codigo: string, data: Partial<Aeronave>): void => {
    setAeronaves(prev => prev.map(a => a.codigo === codigo ? { ...a, ...data } : a));
  };

  const getTotalAeronaves = (): number => {
    return aeronaves.length;
  };

  const getAeronavesByTipo = (tipo: TipoAeronave): Aeronave[] => {
    return aeronaves.filter(aeronave => aeronave.tipo === tipo);
  };

  const value: AeronaveContextType = {
    aeronaves,
    loading,
    error,
    getAeronaveById,
    createAeronave,
    updateAeronave,
    deleteAeronave,
    patchAeronaveLocal,
    getTotalAeronaves,
    getAeronavesByTipo
  };

  return (
    <AeronaveContext.Provider value={value}>
      {children}
    </AeronaveContext.Provider>
  );
}

export function useAeronaves() {
  const context = useContext(AeronaveContext);
  if (context === undefined) {
    throw new Error('useAeronaves must be used within an AeronaveProvider');
  }
  return context;
}