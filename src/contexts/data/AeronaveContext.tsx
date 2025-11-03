import { createContext, useContext, useState, ReactNode } from 'react';
import { TipoAeronave } from '../../types/enums';
import type { Aeronave, AeronaveFormData } from '../../types/index';

interface AeronaveContextType {
  aeronaves: Aeronave[];
  loading: boolean;
  error: string | null;
  
  // CRUD Operations
  getAeronaveById: (codigo: string) => Aeronave | undefined;
  createAeronave: (data: AeronaveFormData) => Promise<void>;
  updateAeronave: (codigo: string, data: Partial<AeronaveFormData>) => Promise<void>;
  deleteAeronave: (codigo: string) => Promise<void>;
  
  // Statistics
  getTotalAeronaves: () => number;
  getAeronavesByTipo: (tipo: TipoAeronave) => Aeronave[];
}

const AeronaveContext = createContext<AeronaveContextType | undefined>(undefined);

// Mock data inicial
const mockAeronaves: Aeronave[] = [
  {
    codigo: '007',
    modelo: 'Caça F-39 Gripen',
    tipo: TipoAeronave.MILITAR,
    capacidade: 1,
    alcance: 4000,
    pecas: [
      {
        codigo: 'P001',
        nome: 'Motor Turbofan',
        tipo: 'IMPORTADA' as any,
        fornecedor: 'Rolls-Royce',
        status: 'PRONTA' as any
      },
      {
        codigo: 'P002',
        nome: 'Sistema de Navegação',
        tipo: 'IMPORTADA' as any,
        fornecedor: 'Thales',
        status: 'EM_PRODUCAO' as any
      }
    ],
    etapas: [
      {
        id: 'E001',
        nome: 'Montagem da Fuselagem',
        prazo: '2025-01-15',
        status: 'CONCLUIDA' as any,
        funcionarios: []
      },
      {
        id: 'E002',
        nome: 'Instalação de Sistemas',
        prazo: '2025-02-01',
        status: 'ANDAMENTO' as any,
        funcionarios: []
      },
      {
        id: 'E003',
        nome: 'Testes de Voo',
        prazo: '2025-02-15',
        status: 'PENDENTE' as any,
        funcionarios: []
      }
    ],
    testes: [
      {
        id: 'T001',
        tipo: 'ELETRICO' as any,
        resultado: 'APROVADO' as any
      },
      {
        id: 'T002',
        tipo: 'HIDRAULICO' as any,
        resultado: 'NAO_REALIZADO' as any
      }
    ]
  },
  {
    codigo: '747',
    modelo: 'Boeing 747-8F',
    tipo: TipoAeronave.COMERCIAL,
    capacidade: 416,
    alcance: 13450,
    pecas: [
      {
        codigo: 'P003',
        nome: 'Trem de Pouso Principal',
        tipo: 'IMPORTADA' as any,
        fornecedor: 'Safran Landing Systems',
        status: 'PRONTA' as any
      },
      {
        codigo: 'P004',
        nome: 'Flaps',
        tipo: 'NACIONAL' as any,
        fornecedor: 'Embraer',
        status: 'EM_TRANSPORTE' as any
      }
    ],
    etapas: [
      {
        id: 'E004',
        nome: 'Montagem de Asas',
        prazo: '2025-01-30',
        status: 'ANDAMENTO' as any,
        funcionarios: []
      },
      {
        id: 'E005',
        nome: 'Instalação de Motores',
        prazo: '2025-02-10',
        status: 'PENDENTE' as any,
        funcionarios: []
      }
    ],
    testes: [
      {
        id: 'T003',
        tipo: 'AERODINAMICO' as any,
        resultado: 'APROVADO' as any
      }
    ]
  }
];

export function AeronaveProvider({ children }: { children: ReactNode }) {
  const [aeronaves, setAeronaves] = useState<Aeronave[]>(mockAeronaves);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAeronaveById = (codigo: string): Aeronave | undefined => {
    return aeronaves.find(aeronave => aeronave.codigo === codigo);
  };

  const createAeronave = async (data: AeronaveFormData): Promise<void> => {
    setLoading(true);
    try {
      const newAeronave: Aeronave = {
        ...data,
        pecas: [],
        etapas: [],
        testes: [],
        dataCriacao: new Date(),
        dataUltimaAtualizacao: new Date()
      };
      
      setAeronaves(prev => [...prev, newAeronave]);
      setError(null);
    } catch (err) {
      setError('Erro ao criar aeronave');
    } finally {
      setLoading(false);
    }
  };

  const updateAeronave = async (codigo: string, data: Partial<AeronaveFormData>): Promise<void> => {
    setLoading(true);
    try {
      setAeronaves(prev => 
        prev.map(aeronave => 
          aeronave.codigo === codigo 
            ? { ...aeronave, ...data, dataUltimaAtualizacao: new Date() }
            : aeronave
        )
      );
      setError(null);
    } catch (err) {
      setError('Erro ao atualizar aeronave');
    } finally {
      setLoading(false);
    }
  };

  const deleteAeronave = async (codigo: string): Promise<void> => {
    setLoading(true);
    try {
      setAeronaves(prev => prev.filter(aeronave => aeronave.codigo !== codigo));
      setError(null);
    } catch (err) {
      setError('Erro ao deletar aeronave');
    } finally {
      setLoading(false);
    }
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