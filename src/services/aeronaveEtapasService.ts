import type { Etapa } from "../types";
import { http } from "./apiService";
import { StatusEtapa } from "../types/enums";

export const aeronaveEtapasService = {
  list: async (aeronaveCodigo: string): Promise<Etapa[]> => {
    return http.get<Etapa[]>(`/aeronaves/${aeronaveCodigo}/etapas`);
  },
  create: async (
    aeronaveCodigo: string,
    data: { nome: string; prazo?: string; status?: StatusEtapa }
  ): Promise<Etapa> => {
    return http.post<Etapa>(`/aeronaves/${aeronaveCodigo}/etapas`, data);
  },
  update: async (
    aeronaveCodigo: string,
    etapaId: number,
    data: { nome?: string; prazo?: string; status?: StatusEtapa }
  ): Promise<Etapa> => {
    return http.put<Etapa>(`/aeronaves/${aeronaveCodigo}/etapas/${etapaId}`, data);
  },
  delete: async (aeronaveCodigo: string, etapaId: number): Promise<void> => {
    await http.delete<void>(`/aeronaves/${aeronaveCodigo}/etapas/${etapaId}`);
  },
  addFuncionario: async (
    aeronaveCodigo: string,
    etapaId: number,
    funcionarioId: number
  ): Promise<void> => {
    await http.post<void>(`/aeronaves/${aeronaveCodigo}/etapas/${etapaId}/funcionarios`, { funcionarioId });
  },
  removeFuncionario: async (
    aeronaveCodigo: string,
    etapaId: number,
    funcionarioId: number
  ): Promise<void> => {
    await http.delete<void>(`/aeronaves/${aeronaveCodigo}/etapas/${etapaId}/funcionarios/${funcionarioId}`);
  },
};

export default aeronaveEtapasService;
