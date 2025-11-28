/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useParams } from 'react-router';
import { PlusIcon, XIcon, PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react';
import { useAeronaves } from '../../contexts/data/AeronaveContext';
import { aeronavesService } from '../../services/aeronavesService';
import { aeronaveEtapasService } from '../../services/aeronaveEtapasService';
import { useFuncionarios } from '../../contexts/data/FuncionarioContext';
import { StatusEtapa } from '../../types/enums';
import type { Etapa } from '../../types';

type AssocFuncionario = { id?: string; nome?: string };
type EtapaItem = { id: string; nome: string; prazo: string; status: StatusEtapa; funcionarios: AssocFuncionario[] };

function badge(status: StatusEtapa) {
    switch (status) {
        case StatusEtapa.PENDENTE: return 'bg-zinc-200 text-zinc-700 border border-zinc-300';
        case StatusEtapa.ANDAMENTO: return 'bg-amber-100 text-amber-800 border border-amber-300';
        case StatusEtapa.CONCLUIDA: return 'bg-green-100 text-green-800 border border-green-300';
    }
}

function GerenciaEtapas() {
    const { aeronaveId } = useParams();
    const { getAeronaveById, patchAeronaveLocal } = useAeronaves();
    const { funcionarios } = useFuncionarios();
    const aeronave = getAeronaveById(aeronaveId || '');

    const [novoOpen, setNovoOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selecionada, setSelecionada] = useState<EtapaItem | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [appearNovo, setAppearNovo] = useState(false);
    const [appearEditar, setAppearEditar] = useState(false);
    const [appearDelete, setAppearDelete] = useState(false);

    const [novo, setNovo] = useState<{ nome: string; prazo: string }>({ nome: '', prazo: '' });
    const [novoFuncionarioId, setNovoFuncionarioId] = useState<string>('');

    const etapas = useMemo(() => (aeronave?.etapas ?? []) as Etapa[], [aeronave]);

    const stats = useMemo(() => {
        const total = etapas.length;
        const pendentes = etapas.filter(e => e.status === StatusEtapa.PENDENTE).length;
        const progresso = etapas.filter(e => e.status === StatusEtapa.ANDAMENTO).length;
        const concluidas = etapas.filter(e => e.status === StatusEtapa.CONCLUIDA).length;
        return { total, pendentes, progresso, concluidas };
    }, [etapas]);

    const porStatus = useMemo(() => ({
        PENDENTE: etapas.filter(e => e.status === StatusEtapa.PENDENTE),
        ANDAMENTO: etapas.filter(e => e.status === StatusEtapa.ANDAMENTO),
        CONCLUIDA: etapas.filter(e => e.status === StatusEtapa.CONCLUIDA),
    }), [etapas]);

    // Animações de entrada dos modais
    useEffect(() => {
        if (novoOpen) {
            const id = requestAnimationFrame(() => setAppearNovo(true));
            return () => cancelAnimationFrame(id);
        }
        setAppearNovo(false);
    }, [novoOpen]);

    useEffect(() => {
        if (modalOpen) {
            const id = requestAnimationFrame(() => setAppearEditar(true));
            return () => cancelAnimationFrame(id);
        }
        setAppearEditar(false);
    }, [modalOpen]);

    useEffect(() => {
        if (deleteOpen) {
            const id = requestAnimationFrame(() => setAppearDelete(true));
            return () => cancelAnimationFrame(id);
        }
        setAppearDelete(false);
    }, [deleteOpen]);

    if (!aeronave) {
        return (
            <div className="flex items-center justify-center h-full text-zinc-600">Aeronave não encontrada.</div>
        );
    }

    const toNumId = (id: string | number) => (typeof id === 'number' ? id : Number(id));

    const criarEtapa = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await aeronaveEtapasService.create(aeronave.codigo, { nome: novo.nome.trim(), prazo: novo.prazo || undefined, status: StatusEtapa.PENDENTE });
        const refreshed = await aeronavesService.get(aeronave.codigo);
        patchAeronaveLocal(aeronave.codigo, { etapas: refreshed.etapas } as any);
        setNovo({ nome: '', prazo: '' });
        setNovoOpen(false);
    };

    const abrirModal = (etapa: EtapaItem) => {
        setSelecionada(etapa);
        setModalOpen(true);
    };

    const salvarEdicao = async (payload: Partial<EtapaItem>) => {
        if (!selecionada) return;
        const etapaNum = toNumId(selecionada.id);
        await aeronaveEtapasService.update(aeronave.codigo, etapaNum, { nome: payload.nome, prazo: payload.prazo, status: payload.status });
        const refreshed = await aeronavesService.get(aeronave.codigo);
        patchAeronaveLocal(aeronave.codigo, { etapas: refreshed.etapas } as any);
        const atual = refreshed.etapas.find((e: any) => String(e.id) === String(selecionada.id)) as any;
        setSelecionada(atual as EtapaItem);
    };

    const excluir = async () => {
        if (!selecionada) return;
        const etapaNum = toNumId(selecionada.id);
        await aeronaveEtapasService.delete(aeronave.codigo, etapaNum);
        const refreshed = await aeronavesService.get(aeronave.codigo);
        patchAeronaveLocal(aeronave.codigo, { etapas: refreshed.etapas } as any);
        setDeleteOpen(false);
        setModalOpen(false);
        setSelecionada(null);
    };

    const Coluna = ({ titulo, status, itens }: { titulo: string; status: StatusEtapa; itens: EtapaItem[] }) => (
        <div className="flex-1 bg-zinc-100 rounded-lg border border-zinc-200 p-3 min-h-[400px]">
            <div className={`inline-block text-xs px-2 py-1 rounded ${badge(status)}`}>{titulo}</div>
            <div className="mt-3 flex flex-col gap-3">
                {itens.map((e) => (
                    <button
                        key={e.id}
                        onClick={() => abrirModal(e)}
                        className="text-left bg-white border border-zinc-300 rounded shadow-sm hover:shadow-md transition-shadow p-3 cursor-pointer"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-zinc-900">{e.nome}</h4>
                        </div>
                        <div className="flex justify-between text-sm bg-zinc-100 border border-zinc-200 rounded p-2">
                            <span className="text-zinc-600">Prazo</span>
                            <span className="font-semibold">{e.prazo || '-'}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-2">
                            <span className="text-zinc-600">Funcionários Associados</span>
                            <span className="font-semibold">{e.funcionarios?.length ?? 0}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-4">
            {/* Cabeçalho */}
            <div className="w-full flex justify-between items-center">
                <h2 className="text-3xl font-semibold">Etapas</h2>
                <button
                    onClick={() => setNovoOpen(true)}
                    className="flex bg-blue-500 text-white px-4 py-2 rounded gap-2 items-center font-semibold hover:bg-blue-600 cursor-pointer"
                >
                    <PlusIcon size={22} weight="bold" />
                    Nova Etapa
                </button>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-4 gap-3">
                <div className="bg-zinc-100 border border-zinc-200 rounded-lg p-4">
                    <div className="text-sm text-zinc-600">Total de Etapas</div>
                    <div className="text-2xl font-bold">{stats.total}</div>
                </div>
                <div className="bg-zinc-100 border border-zinc-200 rounded-lg p-4">
                    <div className="text-sm text-zinc-600">Etapas Pendentes</div>
                    <div className="text-2xl font-bold">{stats.pendentes}</div>
                </div>
                <div className="bg-zinc-100 border border-zinc-200 rounded-lg p-4">
                    <div className="text-sm text-zinc-600">Etapas Em Progresso</div>
                    <div className="text-2xl font-bold">{stats.progresso}</div>
                </div>
                <div className="bg-zinc-100 border border-zinc-200 rounded-lg p-4">
                    <div className="text-sm text-zinc-600">Etapas Concluídas</div>
                    <div className="text-2xl font-bold">{stats.concluidas}</div>
                </div>
            </div>

            {/* Kanban */}
            <div className="flex gap-4">
                <Coluna titulo="Pendente" status={StatusEtapa.PENDENTE} itens={porStatus.PENDENTE as unknown as EtapaItem[]} />
                <Coluna titulo="Em Andamento" status={StatusEtapa.ANDAMENTO} itens={porStatus.ANDAMENTO as unknown as EtapaItem[]} />
                <Coluna titulo="Concluída" status={StatusEtapa.CONCLUIDA} itens={porStatus.CONCLUIDA as unknown as EtapaItem[]} />
            </div>

            {/* Modal Nova Etapa */}
            {novoOpen && (
                <div className={`fixed inset-0 bg-black/40 flex items-center justify-center z-50 transition-opacity duration-200 ${appearNovo ? 'opacity-100' : 'opacity-0'}`}>
                    <div className={`w-[520px] bg-white rounded-lg shadow-lg border border-zinc-200 p-4 transition-all duration-200 ease-out ${appearNovo ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xl font-semibold">Nova Etapa</h3>
                            <button aria-label="Fechar" onClick={() => setNovoOpen(false)} className="p-2 hover:bg-zinc-100 rounded cursor-pointer">
                                <XIcon size={20} />
                            </button>
                        </div>
                        <form onSubmit={criarEtapa} className="grid grid-cols-6 gap-3">
                            <div className="col-span-4 flex flex-col gap-1">
                                <label htmlFor="etp-nome" className="text-sm font-semibold">Nome</label>
                                <input id="etp-nome" placeholder="Nome da etapa" className="p-2 rounded border border-zinc-300 bg-white"
                                    value={novo.nome} onChange={(e) => setNovo(v => ({ ...v, nome: e.target.value }))} required />
                            </div>
                            <div className="col-span-2 flex flex-col gap-1">
                                <label htmlFor="etp-prazo" className="text-sm font-semibold">Prazo</label>
                                <input id="etp-prazo" type="date" className="p-2 rounded border border-zinc-300 bg-white"
                                    value={novo.prazo} onChange={(e) => setNovo(v => ({ ...v, prazo: e.target.value }))} />
                            </div>
                            <div className="col-span-6 flex justify-end gap-2 mt-2">
                                <button type="button" onClick={() => setNovoOpen(false)} className="px-4 py-2 rounded border border-zinc-300 bg-white hover:bg-zinc-50 cursor-pointer">Cancelar</button>
                                <button type="submit" className="px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 cursor-pointer">Criar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Etapa */}
            {modalOpen && selecionada && (
                <div className={`fixed inset-0 bg-black/40 flex items-center justify-center z-50 transition-opacity duration-200 ${appearEditar ? 'opacity-100' : 'opacity-0'}`}>
                    <div className={`w-[620px] bg-white rounded-lg shadow-lg border border-zinc-200 p-4 transition-all duration-200 ease-out ${appearEditar ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-semibold">{selecionada.nome}</h3>
                                <span className={`text-xs px-2 py-1 rounded ${badge(selecionada.status)}`}>{
                                    selecionada.status === StatusEtapa.PENDENTE ? 'Pendente' : selecionada.status === StatusEtapa.ANDAMENTO ? 'Em Andamento' : 'Concluída'
                                }</span>
                            </div>
                            <button aria-label="Fechar" onClick={() => setModalOpen(false)} className="p-2 hover:bg-zinc-100 rounded cursor-pointer">
                                <XIcon size={24} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="md-nome" className="text-sm font-semibold">Nome</label>
                                <input id="md-nome" className="p-2 rounded border border-zinc-300 bg-white"
                                    value={selecionada.nome}
                                    onChange={(e) => setSelecionada(s => s ? { ...s, nome: e.target.value } : s)} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="md-prazo" className="text-sm font-semibold">Prazo</label>
                                <input id="md-prazo" type="date" className="p-2 rounded border border-zinc-300 bg-white"
                                    value={selecionada.prazo}
                                    onChange={(e) => setSelecionada(s => s ? { ...s, prazo: e.target.value } : s)} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="md-status" className="text-sm font-semibold">Status</label>
                                <select id="md-status" className="p-2 rounded border border-zinc-300 bg-white cursor-pointer"
                                    value={selecionada.status}
                                    onChange={(e) => setSelecionada(s => s ? { ...s, status: e.target.value as StatusEtapa } : s)}>
                                    <option value={StatusEtapa.PENDENTE}>Pendente</option>
                                    <option value={StatusEtapa.ANDAMENTO}>Em Andamento</option>
                                    <option value={StatusEtapa.CONCLUIDA}>Concluída</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1 col-span-2">
                                <label className="text-sm font-semibold">Funcionários Associados</label>
                                <div className="text-xs text-zinc-500 mb-1">Total: {selecionada.funcionarios?.length ?? 0}</div>
                                <div className="rounded border border-zinc-300 bg-white max-h-48 overflow-auto">
                                    {(!selecionada.funcionarios || selecionada.funcionarios.length === 0) ? (
                                        <div className="p-2 text-sm text-zinc-500">Nenhum funcionário associado.</div>
                                    ) : (
                                        <table className="w-full text-sm">
                                            <thead className="bg-zinc-100 border-b border-zinc-200">
                                                <tr>
                                                    <th className="px-2 py-1 text-left font-semibold text-zinc-700">Nome</th>
                                                    <th className="px-2 py-1 text-left font-semibold text-zinc-700">ID</th>
                                                    <th className="px-2 py-1 text-right font-semibold text-zinc-700">Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selecionada.funcionarios.map((f, idx) => {
                                                    const full = f.id ? funcionarios.find(x => x.id === f.id) : undefined;
                                                    const nome = f.nome || full?.nome || '(sem nome)';
                                                    const id = f.id || full?.id || '-';
                                                    const key = f.id ?? `${idx}-${nome}`;
                                                    return (
                                                        <tr key={key} className="border-t border-zinc-200">
                                                            <td className="px-2 py-1 text-zinc-800">{nome}</td>
                                                            <td className="px-2 py-1 text-zinc-600 font-mono text-xs">{id}</td>
                                                            <td className="px-2 py-1 text-right">
                                                                <button
                                                                    type="button"
                                                                    aria-label="Remover funcionário"
                                                                    className="inline-flex items-center justify-center p-1.5 rounded hover:bg-red-100 text-red-600 cursor-pointer"
                                                                    onClick={async () => {
                                                                        if (!selecionada) return;
                                                                        const etapaNum = toNumId(selecionada.id);
                                                                        const full = (selecionada.funcionarios[idx]);
                                                                        const funcIdStr = full.id ?? funcionarios.find(x => x.nome === full.nome)?.id;
                                                                        if (!funcIdStr) return;
                                                                        await aeronaveEtapasService.removeFuncionario(aeronave.codigo, etapaNum, Number(funcIdStr));
                                                                        const refreshed = await aeronavesService.get(aeronave.codigo);
                                                                        patchAeronaveLocal(aeronave.codigo, { etapas: refreshed.etapas } as any);
                                                                        const atual = refreshed.etapas.find((e: any) => String(e.id) === String(selecionada.id)) as any;
                                                                        setSelecionada(atual as EtapaItem);
                                                                    }}
                                                                >
                                                                    <XIcon size={16} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                                {/* Associar novo funcionário */}
                                <div className="mt-2 flex items-center gap-2">
                                    <select
                                        className="p-2 rounded border border-zinc-300 bg-white min-w-60 cursor-pointer"
                                        value={novoFuncionarioId}
                                        onChange={(e) => setNovoFuncionarioId(e.target.value)}
                                    >
                                        <option value="">Selecionar funcionário…</option>
                                        {funcionarios
                                            .filter(f => !(selecionada.funcionarios ?? []).some(a => a.id === f.id))
                                            .map(f => (
                                                <option key={f.id} value={f.id}>{f.nome} ({f.id})</option>
                                            ))}
                                    </select>
                                    <button
                                        type="button"
                                        className="px-3 py-2 rounded bg-emerald-500 text-white font-semibold hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                        disabled={!novoFuncionarioId}
                                        onClick={async () => {
                                            if (!selecionada || !novoFuncionarioId) return;
                                            const etapaNum = toNumId(selecionada.id);
                                            await aeronaveEtapasService.addFuncionario(aeronave.codigo, etapaNum, Number(novoFuncionarioId));
                                            const refreshed = await aeronavesService.get(aeronave.codigo);
                                            patchAeronaveLocal(aeronave.codigo, { etapas: refreshed.etapas } as any);
                                            const atual = refreshed.etapas.find((e: any) => String(e.id) === String(selecionada.id)) as any;
                                            setSelecionada(atual as EtapaItem);
                                            setNovoFuncionarioId('');
                                        }}
                                    >
                                        Associar
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <button onClick={() => setDeleteOpen(true)} className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 flex items-center gap-2 cursor-pointer">
                                <TrashIcon size={24} weight='bold' /> Excluir Etapa
                            </button>
                            <div className="flex gap-2">
                                <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded border border-zinc-300 bg-white hover:bg-zinc-50 cursor-pointer">Cancelar</button>
                                <button onClick={() => { salvarEdicao({ nome: selecionada.nome, prazo: selecionada.prazo, status: selecionada.status }); setModalOpen(false); }}
                                    className="px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 flex items-center gap-2 cursor-pointer">
                                    <PencilSimpleIcon size={24} weight='bold' /> Salvar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Confirmar Exclusão de Etapa */}
            {deleteOpen && selecionada && (
                <div className={`fixed inset-0 bg-black/40 flex items-center justify-center z-50 transition-opacity duration-200 ${appearDelete ? 'opacity-100' : 'opacity-0'}`}>
                    <div className={`w-[520px] bg-white rounded-lg shadow-lg border border-zinc-200 p-4 transition-all duration-200 ease-out ${appearDelete ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xl font-semibold">Excluir Etapa</h3>
                            <button aria-label="Fechar" onClick={() => setDeleteOpen(false)} className="p-2 hover:bg-zinc-100 rounded cursor-pointer">
                                <XIcon size={20} />
                            </button>
                        </div>
                        <p className="text-zinc-700 mb-4">Tem certeza que deseja excluir a etapa <span className="font-semibold">{selecionada.nome}</span>?</p>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setDeleteOpen(false)} className="px-4 py-2 rounded border border-zinc-300 bg-white hover:bg-zinc-50 cursor-pointer">Cancelar</button>
                            <button onClick={excluir} className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 cursor-pointer">Excluir</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GerenciaEtapas;
