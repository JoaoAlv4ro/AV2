import type { Aeronave, Etapa, Funcionario, Peca, Teste } from "../types";
import { NivelPermissao, ResultadoTeste, StatusEtapa, StatusPeca, TipoAeronave, TipoPeca, TipoTeste } from "../types/enums";

// Shapes crus (conforme mock-data.json)
type RawFuncionario = {
  id: string;
  nome: string;
  telefone: string;
  endereco: string;
  usuario: string;
  senha: string;
  nivelPermissao: string;
};

// Normalizado (por ID)
type RawPecaById = {
  id: string; // será mapeado para Peca.codigo
  aeronaveCodigo: string;
  nome: string;
  tipo: string; // TipoPeca value
  fornecedor: string;
  status: string; // StatusPeca value
};

type RawEtapaById = {
  id: string;
  aeronaveCodigo: string;
  nome: string;
  prazo: string; // ISO string
  status: string; // StatusEtapa value
  funcionarioIds: string[];
};

type RawTeste = {
  id: string;
  aeronaveCodigo: string;
  tipo: string; // TipoTeste value
  resultado: string; // ResultadoTeste value
};

type RawAeronaveByRef = {
  codigo: string;
  modelo: string;
  tipo: string; // TipoAeronave value
  capacidade: number;
  alcance: number;
  pecaIds: string[];
  etapaIds: string[];
  testeIds: string[];
};

// Aninhado (objetos completos)
type RawPecaNested = {
  codigo: string;
  nome: string;
  tipo: string;
  fornecedor: string;
  status: string;
};

type RawEtapaNested = {
  id: string;
  nome: string;
  prazo: string;
  status: string;
  funcionarios: RawFuncionario[];
};

type RawAeronaveNested = {
  codigo: string;
  modelo: string;
  tipo: string;
  capacidade: number;
  alcance: number;
  pecas?: RawPecaNested[];
  etapas?: RawEtapaNested[];
  testes?: Array<Pick<RawTeste, 'id' | 'tipo' | 'resultado'>>;
};

export type RawMockData = {
  funcionarios: RawFuncionario[];
  aeronaves: Array<RawAeronaveByRef | RawAeronaveNested>;
  pecas?: RawPecaById[];
  etapas?: RawEtapaById[];
  testes?: RawTeste[];
};

export async function fetchMockData(): Promise<RawMockData> {
  const res = await fetch("/mock-data.json");
  if (!res.ok) {
    throw new Error(`Falha ao carregar mock-data.json: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

function toTipoAeronave(v: string): TipoAeronave {
  return v as TipoAeronave;
}
function toTipoPeca(v: string): TipoPeca {
  return v as TipoPeca;
}
function toStatusPeca(v: string): StatusPeca {
  return v as StatusPeca;
}
function toStatusEtapa(v: string): StatusEtapa {
  return v as StatusEtapa;
}
function toTipoTeste(v: string): TipoTeste {
  return v as TipoTeste;
}
function toResultadoTeste(v: string): ResultadoTeste {
  return v as ResultadoTeste;
}
function toNivelPermissao(v: string): NivelPermissao {
  return v as NivelPermissao;
}

export async function loadDomainData(): Promise<{ funcionarios: Funcionario[]; aeronaves: Aeronave[] }> {
  const raw = await fetchMockData();

  const funcionarios: Funcionario[] = raw.funcionarios.map((f) => ({
    id: f.id,
    nome: f.nome,
    telefone: f.telefone,
    endereco: f.endereco,
    usuario: f.usuario,
    senha: f.senha,
    // enums já vêm como value string idêntico aos enums do projeto
    nivelPermissao: toNivelPermissao(f.nivelPermissao),
  }));

  // índices auxiliares
  const byFuncionarioId = new Map(funcionarios.map((f) => [f.id, f] as const));
  const rawPecasById = new Map((raw.pecas ?? []).map((p) => [p.id, p] as const));
  const rawEtapasById = new Map((raw.etapas ?? []).map((e) => [e.id, e] as const));
  const rawTestesById = new Map((raw.testes ?? []).map((t) => [t.id, t] as const));

  const aeronaves: Aeronave[] = raw.aeronaves.map((a) => {
    // Se veio aninhado, mapeia direto
    if ('pecas' in a || 'etapas' in a || 'testes' in a) {
      const an = a as RawAeronaveNested;
      const pecas: Peca[] = (an.pecas ?? []).map((p) => ({
        codigo: p.codigo,
        nome: p.nome,
        tipo: toTipoPeca(p.tipo),
        fornecedor: p.fornecedor,
        status: toStatusPeca(p.status),
      }));
      const etapas: Etapa[] = (an.etapas ?? []).map((e) => ({
        id: e.id,
        nome: e.nome,
        prazo: e.prazo,
        status: toStatusEtapa(e.status),
        funcionarios: (e.funcionarios ?? []).map((rf) => ({
          id: rf.id,
          nome: rf.nome,
          telefone: rf.telefone,
          endereco: rf.endereco,
          usuario: rf.usuario,
          senha: rf.senha,
          nivelPermissao: toNivelPermissao(rf.nivelPermissao),
        })),
      }));
      const testes: Teste[] = (an.testes ?? []).map((t) => ({
        id: t.id,
        tipo: toTipoTeste(t.tipo),
        resultado: toResultadoTeste(t.resultado),
      }));

      return {
        codigo: an.codigo,
        modelo: an.modelo,
        tipo: toTipoAeronave(an.tipo),
        capacidade: an.capacidade,
        alcance: an.alcance,
        pecas,
        etapas,
        testes,
      } as Aeronave;
    }

    // Caso contrário, normalizado via IDs
    const by = a as RawAeronaveByRef;
    const pecas: Peca[] = by.pecaIds
      .map((id) => rawPecasById.get(id))
      .filter((p): p is RawPecaById => Boolean(p))
      .map((p) => ({
        codigo: p.id,
        nome: p.nome,
        tipo: toTipoPeca(p.tipo),
        fornecedor: p.fornecedor,
        status: toStatusPeca(p.status),
      }));

    const etapas: Etapa[] = by.etapaIds
      .map((id) => rawEtapasById.get(id))
      .filter((e): e is RawEtapaById => Boolean(e))
      .map((e) => ({
        id: e.id,
        nome: e.nome,
        prazo: e.prazo,
        status: toStatusEtapa(e.status),
        funcionarios: e.funcionarioIds
          .map((fid) => byFuncionarioId.get(fid))
          .filter((f): f is Funcionario => Boolean(f)),
      }));

    const testes: Teste[] = by.testeIds
      .map((id) => rawTestesById.get(id))
      .filter((t): t is RawTeste => Boolean(t))
      .map((t) => ({
        id: t.id,
        tipo: toTipoTeste(t.tipo),
        resultado: toResultadoTeste(t.resultado),
      }));

    return {
      codigo: by.codigo,
      modelo: by.modelo,
      tipo: toTipoAeronave(by.tipo),
      capacidade: by.capacidade,
      alcance: by.alcance,
      pecas,
      etapas,
      testes,
    } as Aeronave;
  });

  return { funcionarios, aeronaves };
}
