import type { Teste } from "../types";
import { http } from "./apiService";
import { TipoTeste, ResultadoTeste } from "../types/enums";

export const aeronaveTestesService = {
  list: async (aeronaveCodigo: string): Promise<Teste[]> => {
    return http.get<Teste[]>(`/aeronaves/${aeronaveCodigo}/testes`);
  },
  create: async (
    aeronaveCodigo: string,
    data: { tipo: TipoTeste; resultado: ResultadoTeste }
  ): Promise<Teste> => {
    return http.post<Teste>(`/aeronaves/${aeronaveCodigo}/testes`, data);
  },
  update: async (
    aeronaveCodigo: string,
    testeId: number,
    data: { tipo?: TipoTeste; resultado?: ResultadoTeste }
  ): Promise<Teste> => {
    return http.put<Teste>(`/aeronaves/${aeronaveCodigo}/testes/${testeId}`, data);
  },
  delete: async (aeronaveCodigo: string, testeId: number): Promise<void> => {
    await http.delete<void>(`/aeronaves/${aeronaveCodigo}/testes/${testeId}`);
  },
};

export default aeronaveTestesService;
