import type { Peca } from "../types";
import { http } from "./apiService";
import { TipoPeca, StatusPeca } from "../types/enums";

export const aeronavePecasService = {
  list: async (aeronaveCodigo: string): Promise<Peca[]> => {
    const res = await http.get<Array<Peca & { aeronaveCodigo: string }>>(`/aeronaves/${aeronaveCodigo}/pecas`);
    return res.map(({ aeronaveCodigo: _a, ...p }) => p);
  },
  create: async (
    aeronaveCodigo: string,
    data: { codigo: string; nome: string; tipo: TipoPeca; fornecedor: string; status: StatusPeca }
  ): Promise<Peca> => {
    const res = await http.post<Peca & { aeronaveCodigo: string }>(`/aeronaves/${aeronaveCodigo}/pecas`, data);
    const { aeronaveCodigo: _a, ...p } = res;
    return p;
  },
  update: async (
    aeronaveCodigo: string,
    pecaCodigo: string,
    data: { nome?: string; tipo?: TipoPeca; fornecedor?: string; status?: StatusPeca }
  ): Promise<Peca> => {
    const res = await http.put<Peca & { aeronaveCodigo: string }>(`/aeronaves/${aeronaveCodigo}/pecas/${pecaCodigo}`, data);
    const { aeronaveCodigo: _a, ...p } = res;
    return p;
  },
  delete: async (aeronaveCodigo: string, pecaCodigo: string): Promise<void> => {
    await http.delete<void>(`/aeronaves/${aeronaveCodigo}/pecas/${pecaCodigo}`);
  },
};
