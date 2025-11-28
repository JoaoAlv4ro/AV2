import { DownloadSimpleIcon, NotePencilIcon, TrashIcon, XIcon } from "@phosphor-icons/react";
import { FactoryIcon, PuzzlePieceIcon, TestTubeIcon } from "@phosphor-icons/react";
import { useParams } from "react-router";
import { useAeronaves } from "../../contexts/data/AeronaveContext";
import { useFuncionarios } from "../../contexts/data/FuncionarioContext";
import { useNavigate } from "react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { TipoAeronave } from "../../types/enums";
import type { Funcionario } from "../../types";

function GerenciaAeronave() {
    const { aeronaveId } = useParams();
    const navigate = useNavigate();
    const { getAeronaveById, updateAeronave, deleteAeronave } = useAeronaves();
    const { funcionarios } = useFuncionarios();

    const aeronave = aeronaveId ? getAeronaveById(aeronaveId) : null;

    // Estado para modais
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [appearEdit, setAppearEdit] = useState(false);
    const [appearDelete, setAppearDelete] = useState(false);
    type EditForm = { modelo: string; tipo: TipoAeronave; alcance: string; capacidade: string };
    const [form, setForm] = useState<EditForm>(() => ({
        modelo: aeronave?.modelo ?? "",
        tipo: (aeronave?.tipo as TipoAeronave) ?? TipoAeronave.COMERCIAL,
        alcance: aeronave ? String(aeronave.alcance) : "",
        capacidade: aeronave ? String(aeronave.capacidade) : "",
    }));

    // Animação de entrada dos modais
    useEffect(() => {
        if (editOpen) {
            const id = requestAnimationFrame(() => setAppearEdit(true));
            return () => cancelAnimationFrame(id);
        }
        setAppearEdit(false);
    }, [editOpen]);

    useEffect(() => {
        if (deleteOpen) {
            const id = requestAnimationFrame(() => setAppearDelete(true));
            return () => cancelAnimationFrame(id);
        }
        setAppearDelete(false);
    }, [deleteOpen]);

    // sempre que trocar a aeronave (mudança de rota), atualiza o form
    useMemo(() => {
        if (!aeronave) return;
        setForm({
            modelo: aeronave.modelo,
            tipo: aeronave.tipo as TipoAeronave,
            alcance: String(aeronave.alcance),
            capacidade: String(aeronave.capacidade),
        });
    }, [aeronave]);

    if (!aeronave) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-600">Aeronave não encontrada</h2>
                    <p className="text-gray-500">A aeronave com código "{aeronaveId}" não existe.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col">
                <span className="w-full font-base text-zinc-400">{aeronave.codigo}</span>
                <div className="flex justify-between w-full">
                    <div className="flex gap-3 items-center">
                        <h1 className="font-semibold text-4xl">{aeronave.modelo}</h1>
                        <span className={`px-2 py-1 rounded-2xl inline-flex items-center text-xs font-medium whitespace-nowrap ${aeronave.tipo === 'MILITAR'
                                ? 'bg-green-100 text-green-800 border border-green-300'
                                : 'bg-blue-100 text-blue-800 border border-blue-300'
                            }`}>
                            {aeronave.tipo}
                        </span>
                    </div>
                    <div className="flex gap-3">
                        <button className="p-2.5 bg-blue-500 text-white rounded flex items-center hover:bg-blue-600 cursor-pointer" onClick={() => setEditOpen(true)} aria-label="Editar aeronave">
                            <NotePencilIcon size={32} weight="bold" />
                        </button>
                        <button className="p-2.5 bg-zinc-300 rounded flex items-center hover:bg-zinc-400 cursor-pointer" onClick={() => alert('🚧 Funcionalidade: Baixar relatorio em construção (junto ao backend)!')}>
                            <DownloadSimpleIcon size={32} weight="bold" />
                        </button>
                        <button className="p-2.5 bg-red-300 text-red-950 rounded flex items-center hover:bg-red-400 cursor-pointer" onClick={() => setDeleteOpen(true)} aria-label="Excluir aeronave">
                            <TrashIcon size={32} weight="bold" />
                        </button>
                    </div>
                </div>
                <div className="w-full flex gap-6 text-lg">
                    <p className="text-zinc-600">
                        Alcance:
                        <span className="font-medium text-zinc-950"> {aeronave.alcance.toLocaleString()} km</span>
                    </p>
                    <p className="text-zinc-600">
                        Capacidade:
                        <span className="font-medium text-zinc-950"> {aeronave.capacidade.toLocaleString()} {aeronave.tipo === 'MILITAR' ? 'tripulantes' : 'passageiros'}</span>
                    </p>
                </div>
            </div>

            <div className="w-full h-px bg-zinc-400" />

            {/* Cards de Estatísticas */}
            <div className="flex gap-4 w-full">
                {/* Card Total de Etapas */}
                <div className="flex-1 bg-zinc-900 text-white rounded-lg p-6 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-zinc-300 text-sm font-medium">Total de Etapas</span>
                        <span className="text-3xl font-bold">{aeronave.etapas.length}</span>
                    </div>
                    <div className="bg-zinc-700 p-3 rounded-lg">
                        <FactoryIcon size={32} weight="fill" />
                    </div>
                </div>

                {/* Card Total de Peças */}
                <div className="flex-1 bg-zinc-900 text-white rounded-lg p-6 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-zinc-300 text-sm font-medium">Total de Peças</span>
                        <span className="text-3xl font-bold">{aeronave.pecas.length}</span>
                    </div>
                    <div className="bg-zinc-700 p-3 rounded-lg">
                        <PuzzlePieceIcon size={32} weight="fill" />
                    </div>
                </div>

                {/* Card Total de Testes */}
                <div className="flex-1 bg-zinc-900 text-white rounded-lg p-6 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-zinc-300 text-sm font-medium">Total de Testes</span>
                        <span className="text-3xl font-bold">{aeronave.testes.length}</span>
                    </div>
                    <div className="bg-zinc-700 p-3 rounded-lg">
                        <TestTubeIcon size={32} weight="fill" />
                    </div>
                </div>
            </div>

            <div className="w-full h-px bg-zinc-400" />
            
            {/* Lista de Equipe (Funcionários associados a todas as etapas desta aeronave.) */}
            {(() => {
                type AssocFuncionario = { id?: string; nome?: string };
                // Agrega e retira duplicatas de funcionários
                const equipe = (() => {
                    const map = new Map<string, { id?: string; nome: string; nivel?: string }>();
                    for (const etapa of aeronave.etapas ?? []) {
                        const assoc = (etapa as { funcionarios?: Array<Funcionario | AssocFuncionario> }).funcionarios ?? [];
                        if (assoc.length === 0) continue;
                        for (const f of assoc) {
                            const fid = (f as Funcionario | AssocFuncionario).id as string | undefined;
                            const full = fid ? funcionarios.find(x => x.id === fid) : undefined;
                            const nome = (f as Funcionario | AssocFuncionario)?.nome ?? full?.nome ?? "(sem nome)";
                            const key = fid ?? `nome:${nome}`;
                            if (!map.has(key)) {
                                map.set(key, { id: full?.id ?? fid, nome, nivel: full?.nivelPermissao });
                            }
                        }
                    }
                    return Array.from(map.values());
                })();

                return (
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-semibold">Equipe</h3>
                            <div className="text-sm text-zinc-600">Total de funcionários associados: {equipe.length}</div>
                        </div>
                        <div className="rounded-lg border border-zinc-200 bg-white overflow-hidden">
                            {equipe.length === 0 ? (
                                <div className="p-4 text-zinc-600">Nenhum funcionário associado nas etapas desta aeronave.</div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead className="bg-zinc-100 border-b border-zinc-200">
                                        <tr>
                                            <th className="px-3 py-2 text-left font-semibold text-zinc-700">Nome</th>
                                            <th className="px-3 py-2 text-left font-semibold text-zinc-700">ID</th>
                                            <th className="px-3 py-2 text-left font-semibold text-zinc-700">Nível</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {equipe.map((f, idx) => (
                                            <tr key={f.id ?? `nome-${idx}`} className="border-t border-zinc-200">
            
                                                <td className="px-3 py-2 text-zinc-900">{f.nome}</td>
                                                <td className="px-3 py-2 text-zinc-600 font-mono text-xs">{f.id ?? '-'}</td>
                                                <td className="px-3 py-2 text-zinc-700">{f.nivel ?? '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                );
            })()}

            {/* Modal Editar Aeronave */}
            {editOpen && aeronave && (
                <div className={`fixed inset-0 bg-black/40 flex items-center justify-center z-50 transition-opacity duration-200 ${appearEdit ? 'opacity-100' : 'opacity-0'}`}>
                    <div className={`w-[640px] bg-white rounded-lg shadow-lg border border-zinc-200 p-4 transition-all duration-200 ease-out ${appearEdit ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xl font-semibold">Editar Aeronave</h3>
                            <button aria-label="Fechar" onClick={() => setEditOpen(false)} className="p-2 hover:bg-zinc-100 rounded cursor-pointer">
                                <XIcon size={20} />
                            </button>
                        </div>
                        <form
                            onSubmit={async (e: FormEvent<HTMLFormElement>) => {
                                e.preventDefault();
                                await updateAeronave(aeronave.codigo, {
                                    modelo: form.modelo.trim(),
                                    tipo: form.tipo,
                                    alcance: Number(form.alcance) || 0,
                                    capacidade: Number(form.capacidade) || 0,
                                });
                                setEditOpen(false);
                            }}
                            className="grid grid-cols-6 gap-3"
                        >
                            <div className="col-span-6 flex flex-col gap-1">
                                <label htmlFor="ed-modelo" className="text-sm font-semibold">Modelo</label>
                                <input id="ed-modelo" className="p-2 rounded border border-zinc-300 bg-white"
                                    value={form.modelo} onChange={(e) => setForm(v => ({ ...v, modelo: e.target.value }))} required />
                            </div>
                            <div className="col-span-2 flex flex-col gap-1">
                                <label htmlFor="ed-tipo" className="text-sm font-semibold">Tipo</label>
                                <select id="ed-tipo" className="p-2 rounded border border-zinc-300 bg-white cursor-pointer"
                                    value={form.tipo} onChange={(e) => setForm(v => ({ ...v, tipo: e.target.value as TipoAeronave }))}
                                >
                                    <option value={TipoAeronave.COMERCIAL}>Comercial</option>
                                    <option value={TipoAeronave.MILITAR}>Militar</option>
                                </select>
                            </div>
                            <div className="col-span-2 flex flex-col gap-1">
                                <label htmlFor="ed-alcance" className="text-sm font-semibold">Alcance (km)</label>
                                <input id="ed-alcance" type="number" min={0} placeholder="Ex: 6500" className="p-2 rounded border border-zinc-300 bg-white"
                                    value={form.alcance} onChange={(e) => setForm(v => ({ ...v, alcance: e.target.value }))} />
                            </div>
                            <div className="col-span-2 flex flex-col gap-1">
                                <label htmlFor="ed-capacidade" className="text-sm font-semibold">Capacidade</label>
                                <input id="ed-capacidade" type="number" min={0} placeholder="Ex: 180" className="p-2 rounded border border-zinc-300 bg-white"
                                    value={form.capacidade} onChange={(e) => setForm(v => ({ ...v, capacidade: e.target.value }))} />
                            </div>
                            <div className="col-span-6 flex justify-end gap-2 mt-2">
                                <button type="button" onClick={() => setEditOpen(false)} className="px-4 py-2 rounded border border-zinc-300 bg-white hover:bg-zinc-50 cursor-pointer">Cancelar</button>
                                <button type="submit" className="px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 cursor-pointer">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Confirmar Exclusão */}
            {deleteOpen && aeronave && (
                <div className={`fixed inset-0 bg-black/40 flex items-center justify-center z-50 transition-opacity duration-200 ${appearDelete ? 'opacity-100' : 'opacity-0'}`}>
                    <div className={`w-[520px] bg-white rounded-lg shadow-lg border border-zinc-200 p-4 transition-all duration-200 ease-out ${appearDelete ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xl font-semibold">Excluir Aeronave</h3>
                            <button aria-label="Fechar" onClick={() => setDeleteOpen(false)} className="p-2 hover:bg-zinc-100 rounded cursor-pointer">
                                <XIcon size={20} />
                            </button>
                        </div>
                        <p className="text-zinc-700 mb-4">Tem certeza que deseja excluir a aeronave <span className="font-semibold">{aeronave.modelo}</span> ({aeronave.codigo})? Esta ação não pode ser desfeita.</p>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setDeleteOpen(false)} className="px-4 py-2 rounded border border-zinc-300 bg-white hover:bg-zinc-50 cursor-pointer">Cancelar</button>
                            <button
                                onClick={async () => { await deleteAeronave(aeronave.codigo); setDeleteOpen(false); navigate('/home'); }}
                                className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 cursor-pointer"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default GerenciaAeronave;