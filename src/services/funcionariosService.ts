import type { Funcionario } from "../types";
import type { NivelPermissao } from "../types/enums";
import { http } from "./apiService";


const FUNCIONARIO_ENDPOINT = '/funcionarios';

type BackendFuncionario = {
    id: number;
    nome: string;
    telefone: string;
    endereco: string;
    username: string;
    password: string;
    permissao: NivelPermissao;
};

type BackendFuncionarioCreate = {
    nome: string;
    telefone: string;
    endereco: string;
    username: string;
    password: string;
    permissao: NivelPermissao;
};

type BackendFuncionarioUpdate = {
    nome?: string;
    telefone?: string;
    endereco?: string;
    username?: string;
    password?: string;
    permissao?: NivelPermissao;
};

const fromApi = (f: BackendFuncionario): Funcionario => ({
    id: String(f.id),
    nome: f.nome,
    telefone: f.telefone,
    endereco: f.endereco,
    usuario: f.username,
    senha: f.password,
    nivelPermissao: f.permissao,
});

// Payload para criação (senha obrigatória)
const toApiCreate = (f: Omit<Funcionario, 'id'>): BackendFuncionarioCreate => ({
    nome: f.nome,
    telefone: f.telefone,
    endereco: f.endereco,
    username: f.usuario,
    password: f.senha,
    permissao: f.nivelPermissao,
});

// Payload para atualização (senha opcional)
const toApiUpdate = (f: Partial<Omit<Funcionario, 'id'>>): BackendFuncionarioUpdate => {
    const payload: BackendFuncionarioUpdate = {
        nome: f.nome,
        telefone: f.telefone,
        endereco: f.endereco,
        username: f.usuario,
        permissao: f.nivelPermissao,
    };
    if (typeof f.senha === 'string' && f.senha.trim().length > 0) {
        payload.password = f.senha.trim();
    }
    return payload;
};

export const funcionariosService = {
    list: async (): Promise<Funcionario[]> => {
        const response = await http.get<BackendFuncionario[]>(FUNCIONARIO_ENDPOINT);
        return response.map(fromApi);
    },
    get: async (id: string): Promise<Funcionario> => {
        const response = await http.get<BackendFuncionario>(`${FUNCIONARIO_ENDPOINT}/${Number(id)}`);
        return fromApi(response);
    },
    create: async (data: Omit<Funcionario, 'id'>): Promise<Funcionario> => {
        const response = await http.post<BackendFuncionario>(FUNCIONARIO_ENDPOINT, toApiCreate(data));
        return fromApi(response);
    },
    update: async (id: string, data: Partial<Omit<Funcionario, 'id'>>): Promise<Funcionario> => {
        const response = await http.put<BackendFuncionario>(`${FUNCIONARIO_ENDPOINT}/${Number(id)}`, toApiUpdate(data));
        return fromApi(response);
    },
    delete: async (id: string): Promise<void> => {
        await http.delete<void>(`${FUNCIONARIO_ENDPOINT}/${Number(id)}`);
    },
};

export default funcionariosService;