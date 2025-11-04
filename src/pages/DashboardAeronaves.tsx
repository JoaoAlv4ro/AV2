import { useNavigate } from "react-router";
import { PlusIcon, XIcon } from "@phosphor-icons/react";
import { useAeronaves } from "../contexts/data/AeronaveContext";
import { useState, type FormEvent } from "react";
import type { AeronaveFormData } from "../types";
import { TipoAeronave } from "../types/enums";

function DashboardAeronaves() {
    const navigate = useNavigate();
    const { aeronaves, loading, createAeronave, error } = useAeronaves();

    // Estado do modal de criação
    const [open, setOpen] = useState(false);
    type FormState = { codigo: string; modelo: string; tipo: TipoAeronave; alcance: string; capacidade: string };
    const [form, setForm] = useState<FormState>({
        codigo: "",
        modelo: "",
        tipo: TipoAeronave.COMERCIAL,
        capacidade: "",
        alcance: "",
    });

    const resetForm = () => setForm({ codigo: "", modelo: "", tipo: TipoAeronave.COMERCIAL, capacidade: "", alcance: "" });

    const aeronaveClick = (codigo: string) => {
        navigate(`../aeronave/${codigo}`)
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando aeronaves...</p>
                </div>
            </div>
        );
    }


    return (
        <>
            <div className="w-full flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold">Aeronaves</h2>
                <button onClick={() => setOpen(true)} className="flex bg-blue-500 text-white p-4  rounded gap-2.5 items-center font-semibold hover:bg-blue-600 cursor-pointer">
                    <PlusIcon size={24} weight="bold" />
                    Adicionar Aeronave
                </button>
            </div>


            {/* If para caso de nenhuma aeronave encontrada */}
            {aeronaves.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-gray-600">Nenhuma aeronave encontrada.</p>
                </div>
            )}

            {/* Grid de Aeronaves */}
            <div className="grid grid-cols-2 gap-4">
                {aeronaves.map((aeronave) => (
                    <div 
                        key={aeronave.codigo}
                        className="bg-zinc-100 rounded-lg shadow-sm border border-zinc-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => aeronaveClick(aeronave.codigo)}
                    >
                        {/* Cabeçalho do Card */}
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-2xl font-bold text-zinc-900">
                                {aeronave.modelo}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                aeronave.tipo === 'Militar' 
                                    ? 'bg-green-100 text-green-800 border border-green-300' 
                                    : 'bg-blue-100 text-blue-800 border border-blue-300'
                            }`}>
                                {aeronave.tipo}
                            </span>
                        </div>

                        {/* Informações */}
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-zinc-600">Código</span>
                                <span className="font-medium">{aeronave.codigo}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-600">Alcance</span>
                                <span className="font-medium">{aeronave.alcance.toLocaleString()} km</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-600">Capacidade</span>
                                <span className="font-medium">
                                    {aeronave.capacidade.toLocaleString()} {aeronave.tipo === 'Militar' ? 'tripulantes' : 'passageiros'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-600">Quantidade de Peças</span>
                                <span className="font-medium">{aeronave.pecas.length}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Nova Aeronave */}
            {open && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="w-[640px] bg-white rounded-lg shadow-lg border border-zinc-200 p-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xl font-semibold">Nova Aeronave</h3>
                            <button aria-label="Fechar" onClick={() => setOpen(false)} className="p-2 hover:bg-zinc-100 rounded cursor-pointer">
                                <XIcon size={20} />
                            </button>
                        </div>
                        <form
                            onSubmit={async (e: FormEvent<HTMLFormElement>) => {
                                e.preventDefault();
                                const payload: AeronaveFormData = {
                                    codigo: form.codigo.trim(),
                                    modelo: form.modelo.trim(),
                                    tipo: form.tipo,
                                    capacidade: Number(form.capacidade) || 0,
                                    alcance: Number(form.alcance) || 0,
                                };
                                await createAeronave(payload);
                                setOpen(false);
                                resetForm();
                            }}
                            className="grid grid-cols-6 gap-3"
                        >
                            <div className="col-span-2 flex flex-col gap-1">
                                <label htmlFor="ar-codigo" className="text-sm font-semibold">Código</label>
                                <input id="ar-codigo" placeholder="Ex: A320-XYZ" className="p-2 rounded border border-zinc-300 bg-white"
                                    value={form.codigo} onChange={(e) => setForm(v => ({ ...v, codigo: e.target.value }))} required />
                            </div>
                            <div className="col-span-4 flex flex-col gap-1">
                                <label htmlFor="ar-modelo" className="text-sm font-semibold">Modelo</label>
                                <input id="ar-modelo" placeholder="Ex: Airbus A320neo" className="p-2 rounded border border-zinc-300 bg-white"
                                    value={form.modelo} onChange={(e) => setForm(v => ({ ...v, modelo: e.target.value }))} required />
                            </div>
                            <div className="col-span-2 flex flex-col gap-1">
                                <label htmlFor="ar-tipo" className="text-sm font-semibold">Tipo</label>
                                <select id="ar-tipo" className="p-2 rounded border border-zinc-300 bg-white cursor-pointer"
                                    value={form.tipo} onChange={(e) => setForm(v => ({ ...v, tipo: e.target.value as TipoAeronave }))}
                                >
                                    <option value={TipoAeronave.COMERCIAL}>Comercial</option>
                                    <option value={TipoAeronave.MILITAR}>Militar</option>
                                </select>
                            </div>
                            <div className="col-span-2 flex flex-col gap-1">
                                <label htmlFor="ar-alcance" className="text-sm font-semibold">Alcance (km)</label>
                                <input id="ar-alcance" type="number" min={0} placeholder="Ex: 6500" className="p-2 rounded border border-zinc-300 bg-white"
                                    value={form.alcance} onChange={(e) => setForm(v => ({ ...v, alcance: e.target.value }))} />
                            </div>
                            <div className="col-span-2 flex flex-col gap-1">
                                <label htmlFor="ar-capacidade" className="text-sm font-semibold">Capacidade</label>
                                <input id="ar-capacidade" type="number" min={0} placeholder="Ex: 180" className="p-2 rounded border border-zinc-300 bg-white"
                                    value={form.capacidade} onChange={(e) => setForm(v => ({ ...v, capacidade: e.target.value }))} />
                            </div>

                            {error && (
                                <div className="col-span-6 text-red-600 text-sm">{error}</div>
                            )}

                            <div className="col-span-6 flex justify-end gap-2 mt-2">
                                <button type="button" onClick={() => { setOpen(false); resetForm(); }} className="px-4 py-2 rounded border border-zinc-300 bg-white hover:bg-zinc-50 cursor-pointer">Cancelar</button>
                                <button type="submit" className="px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 cursor-pointer">Cadastrar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
export default DashboardAeronaves;
