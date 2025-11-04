/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useParams } from 'react-router';
import { PlusIcon, PencilSimpleIcon, TrashIcon, MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react';
import { useAeronaves } from '../../contexts/data/AeronaveContext';
import type { Peca } from '../../types';
import { StatusPeca, TipoPeca } from '../../types/enums';

function GerenciaPecas() {
    const { aeronaveId } = useParams();
    const { getAeronaveById, updateAeronave } = useAeronaves();
    const aeronave = getAeronaveById(aeronaveId || '');

    const pecas = useMemo(() => (aeronave?.pecas ?? []) as Peca[], [aeronave]);

    const [query, setQuery] = useState('');
    const [statusFiltro, setStatusFiltro] = useState<StatusPeca | 'TODOS'>('TODOS');

    const [formOpen, setFormOpen] = useState(false);
    const [deleteCodigo, setDeleteCodigo] = useState<string | null>(null);
    const [appearForm, setAppearForm] = useState(false);
    const [appearDelete, setAppearDelete] = useState(false);
    const [editCodigo, setEditCodigo] = useState<string | null>(null);
    const [form, setForm] = useState<Peca>({ codigo: '', nome: '', tipo: TipoPeca.NACIONAL, fornecedor: '', status: StatusPeca.EM_PRODUCAO });

    const resetForm = () => {
        setEditCodigo(null);
    setForm({ codigo: '', nome: '', tipo: TipoPeca.NACIONAL, fornecedor: '', status: StatusPeca.EM_PRODUCAO });
    };

    const stats = useMemo(() => {
        const total = pecas.length;
        const emProducao = pecas.filter(p => p.status === StatusPeca.EM_PRODUCAO).length;
        const emTransporte = pecas.filter(p => p.status === StatusPeca.EM_TRANSPORTE).length;
        const prontas = pecas.filter(p => p.status === StatusPeca.PRONTA).length;
        return { total, emProducao, emTransporte, prontas };
    }, [pecas]);

    const filtradas = useMemo(() => {
        const q = query.trim().toLowerCase();
        return pecas.filter(p => {
            const matchTexto = !q || [p.codigo, p.nome, p.fornecedor, p.tipo, p.status].some(v => String(v).toLowerCase().includes(q));
            const matchStatus = statusFiltro === 'TODOS' || p.status === statusFiltro;
            return matchTexto && matchStatus;
        });
    }, [pecas, query, statusFiltro]);

    const abrirCriacao = () => {
        resetForm();
        setFormOpen(true);
    };

    const abrirEdicao = (codigo: string) => {
        const found = pecas.find(p => p.codigo === codigo);
        if (!found) return;
        setEditCodigo(found.codigo);
        setForm({ ...found });
        setFormOpen(true);
    };

    // Animações dos modais
    useEffect(() => {
        if (formOpen) {
            const id = requestAnimationFrame(() => setAppearForm(true));
            return () => cancelAnimationFrame(id);
        }
        setAppearForm(false);
    }, [formOpen]);

    useEffect(() => {
        if (deleteCodigo) {
            const id = requestAnimationFrame(() => setAppearDelete(true));
            return () => cancelAnimationFrame(id);
        }
        setAppearDelete(false);
    }, [deleteCodigo]);

    const excluir = async (codigo: string) => {
        const novas = pecas.filter(p => p.codigo !== codigo);
        if (!aeronave?.codigo) return;
        await updateAeronave(aeronave.codigo, { pecas: novas } as any);
        setDeleteCodigo(null);
    };

    const salvar = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const payload = { ...form, codigo: form.codigo.trim(), nome: form.nome.trim(), fornecedor: form.fornecedor.trim() };
        let novas: Peca[];
        if (editCodigo) {
            novas = pecas.map(p => p.codigo === editCodigo ? payload : p);
        } else {
            const existe = pecas.some(p => p.codigo === payload.codigo);
            novas = existe ? pecas.map(p => p.codigo === payload.codigo ? payload : p) : [...pecas, payload];
        }
        if (!aeronave?.codigo) return;
        await updateAeronave(aeronave.codigo, { pecas: novas } as any);
        setFormOpen(false);
        resetForm();
    };

    return (
            <div className="flex flex-col gap-4">
                {!aeronave && (
                    <div className="flex items-center justify-center h-full text-zinc-600">Aeronave não encontrada.</div>
                )}
            {/* Cabeçalho */}
            <div className="w-full flex justify-between items-center">
                <h2 className="text-3xl font-semibold">Peças</h2>
                <button onClick={abrirCriacao} className="flex bg-blue-500 text-white px-4 py-2 rounded gap-2 items-center font-semibold hover:bg-blue-600 cursor-pointer">
                    <PlusIcon size={22} weight="bold" /> Nova Peça
                </button>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-4 gap-3">
                <div className="bg-zinc-100 border border-zinc-200 rounded-lg p-4">
                    <div className="text-sm text-zinc-600">Total de Peças</div>
                    <div className="text-2xl font-bold">{stats.total}</div>
                </div>
                <div className="bg-zinc-100 border border-zinc-200 rounded-lg p-4">
                    <div className="text-sm text-zinc-600">Em Produção</div>
                    <div className="text-2xl font-bold">{stats.emProducao}</div>
                </div>
                <div className="bg-zinc-100 border border-zinc-200 rounded-lg p-4">
                    <div className="text-sm text-zinc-600">Em Transporte</div>
                    <div className="text-2xl font-bold">{stats.emTransporte}</div>
                </div>
                <div className="bg-zinc-100 border border-zinc-200 rounded-lg p-4">
                    <div className="text-sm text-zinc-600">Prontas</div>
                    <div className="text-2xl font-bold">{stats.prontas}</div>
                </div>
            </div>

            {/* Filtros */}
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-white border border-zinc-300 rounded px-2">
                    <MagnifyingGlassIcon size={18} />
                    <input
                        id="peca-search"
                        placeholder="Buscar por código, nome ou fornecedor"
                        className="p-2 outline-none"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <select id="peca-status" className="h-full p-2 rounded border border-zinc-300 bg-white cursor-pointer"
                        value={statusFiltro}
                        onChange={(e) => setStatusFiltro(e.target.value as StatusPeca | 'TODOS')}
                    >
                        <option value="TODOS">Todos</option>
                        <option value={StatusPeca.EM_PRODUCAO}>Em Produção</option>
                        <option value={StatusPeca.EM_TRANSPORTE}>Em Transporte</option>
                        <option value={StatusPeca.PRONTA}>Pronta</option>
                    </select>
                </div>
            </div>

            {/* Tabela */}
            <div className="bg-zinc-100 border border-zinc-200 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-zinc-200">
                        <tr>
                            <th className="px-4 py-2">Código</th>
                            <th className="px-4 py-2">Nome</th>
                            <th className="px-4 py-2">Tipo</th>
                            <th className="px-4 py-2">Fornecedor</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtradas.map((p) => (
                            <tr key={p.codigo} className="border-t border-zinc-200 hover:bg-zinc-50">
                                <td className="px-4 py-2 font-medium">{p.codigo}</td>
                                <td className="px-4 py-2">{p.nome}</td>
                                <td className="px-4 py-2">{p.tipo}</td>
                                <td className="px-4 py-2">{p.fornecedor}</td>
                                <td className="px-4 py-2">{p.status}</td>
                                <td className="px-4 py-2">
                                    <div className="flex gap-2 justify-end">
                                        <button onClick={() => abrirEdicao(p.codigo)}
                                            className="p-2.5 rounded bg-amber-500 text-white hover:bg-amber-600 cursor-pointer flex items-center gap-2">
                                            <PencilSimpleIcon size={24} weight='bold' />
                                        </button>
                                        <button onClick={() => setDeleteCodigo(p.codigo)}
                                            className="p-2.5 rounded bg-red-500 text-white hover:bg-red-600 cursor-pointer flex items-center gap-2">
                                            <TrashIcon size={24} weight='bold' />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filtradas.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-zinc-600">Nenhuma peça encontrada.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Formulário em Modal */}
            {formOpen && (
                <div className={`fixed inset-0 bg-black/40 flex items-center justify-center z-50 transition-opacity duration-200 ${appearForm ? 'opacity-100' : 'opacity-0'}`}>
                    <div className={`w-[720px] bg-white rounded-lg shadow-lg border border-zinc-200 p-4 transition-all duration-200 ease-out ${appearForm ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xl font-semibold">{editCodigo ? 'Editar Peça' : 'Nova Peça'}</h3>
                            <button aria-label="Fechar" onClick={() => { setFormOpen(false); resetForm(); }} className="p-2 hover:bg-zinc-100 rounded cursor-pointer">
                                <XIcon size={20} />
                            </button>
                        </div>
                        <form onSubmit={salvar} className="grid grid-cols-6 gap-3">
                            <div className="col-span-2 flex flex-col gap-1">
                                <label htmlFor="pc-codigo" className="text-sm font-semibold">Código</label>
                                <input id="pc-codigo" placeholder="Ex: P001" className="p-2 rounded border border-zinc-300 bg-white"
                                    value={form.codigo} onChange={(e) => setForm(v => ({ ...v, codigo: e.target.value }))} required disabled={!!editCodigo} />
                            </div>
                            <div className="col-span-2 flex flex-col gap-1">
                                <label htmlFor="pc-nome" className="text-sm font-semibold">Nome</label>
                                <input id="pc-nome" placeholder="Nome da peça" className="p-2 rounded border border-zinc-300 bg-white"
                                    value={form.nome} onChange={(e) => setForm(v => ({ ...v, nome: e.target.value }))} required />
                            </div>
                            <div className="col-span-2 flex flex-col gap-1">
                                <label htmlFor="pc-fornecedor" className="text-sm font-semibold">Fornecedor</label>
                                <input id="pc-fornecedor" placeholder="Fornecedor" className="p-2 rounded border border-zinc-300 bg-white"
                                    value={form.fornecedor} onChange={(e) => setForm(v => ({ ...v, fornecedor: e.target.value }))} required />
                            </div>
                            <div className="col-span-2 flex flex-col gap-1">
                                <label htmlFor="pc-tipo" className="text-sm font-semibold">Tipo</label>
                                <select id="pc-tipo" className="p-2 rounded border border-zinc-300 bg-white"
                                    value={form.tipo} onChange={(e) => setForm(v => ({ ...v, tipo: e.target.value as TipoPeca }))}
                                >
                                    <option value={TipoPeca.NACIONAL}>Nacional</option>
                                    <option value={TipoPeca.IMPORTADA}>Importada</option>
                                </select>
                            </div>
                            <div className="col-span-2 flex flex-col gap-1">
                                <label htmlFor="pc-status" className="text-sm font-semibold">Status</label>
                                <select id="pc-status" className="p-2 rounded border border-zinc-300 bg-white"
                                    value={form.status} onChange={(e) => setForm(v => ({ ...v, status: e.target.value as StatusPeca }))}
                                >
                                    <option value={StatusPeca.EM_PRODUCAO}>Em Produção</option>
                                    <option value={StatusPeca.EM_TRANSPORTE}>Em Transporte</option>
                                    <option value={StatusPeca.PRONTA}>Pronta</option>
                                </select>
                            </div>
                            <div className="col-span-6 flex justify-end gap-2 mt-2">
                                <button type="button" onClick={() => { setFormOpen(false); resetForm(); }} className="px-4 py-2 rounded border border-zinc-300 bg-white hover:bg-zinc-50 cursor-pointer">Cancelar</button>
                                <button type="submit" className="px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 cursor-pointer">
                                    {editCodigo ? 'Salvar alterações' : 'Cadastrar Peça'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Confirmar Exclusão de Peça */}
            {deleteCodigo && (
                <div className={`fixed inset-0 bg-black/40 flex items-center justify-center z-50 transition-opacity duration-200 ${appearDelete ? 'opacity-100' : 'opacity-0'}`}>
                    <div className={`w-[520px] bg-white rounded-lg shadow-lg border border-zinc-200 p-4 transition-all duration-200 ease-out ${appearDelete ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xl font-semibold">Excluir Peça</h3>
                            <button aria-label="Fechar" onClick={() => setDeleteCodigo(null)} className="p-2 hover:bg-zinc-100 rounded cursor-pointer">
                                <XIcon size={20} />
                            </button>
                        </div>
                        <p className="text-zinc-700 mb-4">Tem certeza que deseja excluir a peça <span className="font-semibold">{deleteCodigo}</span>?</p>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setDeleteCodigo(null)} className="px-4 py-2 rounded border border-zinc-300 bg-white hover:bg-zinc-50 cursor-pointer">Cancelar</button>
                            <button onClick={() => excluir(deleteCodigo)} className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 cursor-pointer">Excluir</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GerenciaPecas;
