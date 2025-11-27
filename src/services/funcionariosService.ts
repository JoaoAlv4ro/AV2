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

const fromApi = (f: BackendFuncionario): Funcionario => ({
    id: String(f.id),
    nome: f.nome,
    telefone: f.telefone,
    endereco: f.endereco,
    usuario: f.username,
    senha: f.password,
    nivelPermissao: f.permissao,
});

const toApi = (f: Omit<Funcionario, 'id'> | Partial<Omit<Funcionario, 'id'>>) => ({
    nome: f.nome,
    telefone: f.telefone,
    endereco: f.endereco,
    username: f.usuario,
    password: f.senha,
    permissao: f.nivelPermissao,
});

export const funcionariosService = {
    list: async (): Promise<Funcionario[]> => {
        const response = await http.get<BackendFuncionario[]>(FUNCIONARIO_ENDPOINT);
        return response.map(fromApi);
    },
    get: async (id: string): Promise<Funcionario> => {
        const response = await http.get<BackendFuncionario>(`${FUNCIONARIO_ENDPOINT}/${id}`);
        return fromApi(response);
    },
    create: async (data: Omit<Funcionario, 'id'>): Promise<Funcionario> => {
        const response = await http.post<BackendFuncionario>(FUNCIONARIO_ENDPOINT, toApi(data));
        return fromApi(response);
    },
    update: async (id: string, data: Partial<Omit<Funcionario, 'id'>>): Promise<Funcionario> => {
        const response = await http.put<BackendFuncionario>(`${FUNCIONARIO_ENDPOINT}/${id}`, toApi(data));
        return fromApi(response);
    },
    delete: async (id: string): Promise<void> => {
        await http.delete<void>(`${FUNCIONARIO_ENDPOINT}/${id}`);
    },
};

export default funcionariosService;