import type { Aeronave, AeronaveFormData } from '../types';
import { http } from './apiService';

const AERONAVE_ENDPOINT = '/aeronaves';

export const aeronavesService = {
    list: () => http.get<Aeronave[]>(AERONAVE_ENDPOINT),
    get: (codigo: string) => http.get<Aeronave>(`${AERONAVE_ENDPOINT}/${codigo}`),
    create: (data: AeronaveFormData) => http.post<Aeronave>(AERONAVE_ENDPOINT, data),
    update: (codigo: string, data: Partial<AeronaveFormData>) =>
        http.put<Aeronave>(`${AERONAVE_ENDPOINT}/${codigo}`, data),
    delete: (codigo: string) => http.delete<void>(`${AERONAVE_ENDPOINT}/${codigo}`),
} 

export default aeronavesService;