import { NivelPermissao, ResultadoTeste, StatusEtapa, StatusPeca, TipoAeronave, TipoPeca, TipoTeste } from "../enums";

export interface Funcionario {
    id: string;
    nome: string;
    telefone: string;
    endereco: string;
    usuario: string;
    senha: string;
    nivelPermissao: NivelPermissao;
}

export interface Peca {
    codigo: string;
    nome: string;
    tipo: TipoPeca;
    fornecedor: string;
    status: StatusPeca;
}

export interface Teste {
    id: string;
    tipo: TipoTeste;
    resultado: ResultadoTeste;
    dataRealizacao?: Date;
}

export interface Etapa {
    id: string;
    nome: string;
    prazo: string;
    status: StatusEtapa;
    funcionarios: Funcionario[];
    dataInicio?: Date;
    dataFim?: Date;
}

export interface Aeronave {
    codigo: string;
    modelo: string;
    tipo: TipoAeronave;
    capacidade: number;
    alcance: number;
    pecas: Peca[];
    etapas: Etapa[];
    testes: Teste[];
    dataCriacao?: Date;
    dataUltimaAtualizacao?: Date;
}

// Types para forms e operações CRUD
export interface AeronaveFormData {
    codigo: string;
    modelo: string;
    tipo: TipoAeronave;
    capacidade: number;
    alcance: number;
}

export interface PecaFormData {
    codigo: string;
    nome: string;
    tipo: TipoPeca;
    fornecedor: string;
    status: StatusPeca;
}

export interface EtapaFormData {
    nome: string;
    prazo: string;
    funcionarioIds?: string[];
}

export interface TesteFormData {
    tipo: TipoTeste;
    resultado?: ResultadoTeste;
}

export interface FuncionarioFormData {
    nome: string;
    telefone: string;
    endereco: string;
    usuario: string;
    senha: string;
    nivelPermissao: NivelPermissao;
}