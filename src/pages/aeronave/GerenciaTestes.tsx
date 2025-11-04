/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, type FormEvent } from 'react';
import { useParams } from 'react-router';
import { PlusIcon, PencilSimpleIcon, TrashIcon, XIcon } from '@phosphor-icons/react';
import { useAeronaves } from '../../contexts/data/AeronaveContext';
import { ResultadoTeste, TipoTeste } from '../../types/enums';
import type { Teste } from '../../types';

type TesteItem = Teste;

function nextTesteId(lista: TesteItem[]): string {
    const max = lista
        .map(t => t.id)
        .map(id => {
            const m = /^T(\d+)$/.exec(id);
            return m ? parseInt(m[1], 10) : 0;
        })
        .reduce((a, b) => Math.max(a, b), 0);
    const next = (max || 0) + 1;
    return `T${String(next).padStart(3, '0')}`;
}

function GerenciaTestes() {
    const { aeronaveId } = useParams();
    const { getAeronaveById, updateAeronave } = useAeronaves();
    const aeronave = getAeronaveById(aeronaveId || '');

    const testes = useMemo(() => (aeronave?.testes ?? []) as TesteItem[], [aeronave]);

    const [formOpen, setFormOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState<TesteItem>({ id: '', tipo: TipoTeste.ELETRICO, resultado: ResultadoTeste.NAO_REALIZADO });
    const [tipoFiltro, setTipoFiltro] = useState<TipoTeste | 'TODOS'>('TODOS');
    const [resultadoFiltro, setResultadoFiltro] = useState<ResultadoTeste | 'TODOS'>('TODOS');

    const resetForm = () => {
        setEditId(null);
    setForm({ id: '', tipo: TipoTeste.ELETRICO, resultado: ResultadoTeste.NAO_REALIZADO });
    };

    const stats = useMemo(() => {
    const total = testes.length;
    const aprovados = testes.filter(t => t.resultado === ResultadoTeste.APROVADO).length;
    const reprovados = testes.filter(t => t.resultado === ResultadoTeste.REPROVADO).length;
    const naoRealizados = testes.filter(t => t.resultado === ResultadoTeste.NAO_REALIZADO).length;
        return { total, aprovados, reprovados, naoRealizados };
    }, [testes]);

    const filtrados = useMemo(() => {
        return testes.filter(t => {
            const okTipo = tipoFiltro === 'TODOS' || t.tipo === tipoFiltro;
            const okRes = resultadoFiltro === 'TODOS' || t.resultado === resultadoFiltro;
            return okTipo && okRes;
        });
    }, [testes, tipoFiltro, resultadoFiltro]);

    const abrirCriacao = () => {
        resetForm();
        setFormOpen(true);
    };

    const abrirEdicao = (id: string) => {
        const t = testes.find(x => x.id === id);
        if (!t) return;
        setEditId(id);
        setForm({ ...t });
        setFormOpen(true);
    };

    const excluir = async (id: string) => {
        const novos = testes.filter(t => t.id !== id);
        if (!aeronave?.codigo) return;
        await updateAeronave(aeronave.codigo, { testes: novos } as any);
        setDeleteId(null);
    };

    const salvar = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const id = editId ?? nextTesteId(testes);
        const payload: TesteItem = { id, tipo: form.tipo, resultado: form.resultado };
        const novos = editId
            ? testes.map(t => t.id === editId ? payload : t)
            : [...testes, payload];
        if (!aeronave?.codigo) return;
        await updateAeronave(aeronave.codigo, { testes: novos } as any);
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
                <h2 className="text-3xl font-semibold">Testes</h2>
                <button onClick={abrirCriacao} className="flex bg-blue-500 text-white px-4 py-2 rounded gap-2 items-center font-semibold hover:bg-blue-600 cursor-pointer">
                    <PlusIcon size={22} weight="bold" /> Novo Teste
                </button>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-4 gap-3">
                <div className="bg-zinc-100 border border-zinc-200 rounded-lg p-4">
                    <div className="text-sm text-zinc-600">Total de Testes</div>
                    <div className="text-2xl font-bold">{stats.total}</div>
                </div>
                <div className="bg-zinc-100 border border-zinc-200 rounded-lg p-4">
                    <div className="text-sm text-zinc-600">Não Realizados</div>
                    <div className="text-2xl font-bold">{stats.naoRealizados}</div>
                </div>
                <div className="bg-zinc-100 border border-zinc-200 rounded-lg p-4">
                    <div className="text-sm text-zinc-600">Reprovados</div>
                    <div className="text-2xl font-bold">{stats.reprovados}</div>
                </div>
                <div className="bg-zinc-100 border border-zinc-200 rounded-lg p-4">
                    <div className="text-sm text-zinc-600">Aprovados</div>
                    <div className="text-2xl font-bold">{stats.aprovados}</div>
                </div>
            </div>

            {/* Filtros */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <label htmlFor="flt-tipo" className="text-sm text-zinc-700">Tipo</label>
                    <select id="flt-tipo" className="p-2 rounded border border-zinc-300 bg-white" value={tipoFiltro}
                        onChange={(e) => setTipoFiltro(e.target.value as TipoTeste | 'TODOS')}
                    >
                        <option value="TODOS">Todos</option>
                        <option value={TipoTeste.ELETRICO}>Elétrico</option>
                        <option value={TipoTeste.HIDRAULICO}>Hidráulico</option>
                        <option value={TipoTeste.AERODINAMICO}>Aerodinâmico</option>
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <label htmlFor="flt-res" className="text-sm text-zinc-700">Resultado</label>
                    <select id="flt-res" className="p-2 rounded border border-zinc-300 bg-white" value={resultadoFiltro}
                        onChange={(e) => setResultadoFiltro(e.target.value as ResultadoTeste | 'TODOS')}
                    >
                        <option value="TODOS">Todos</option>
                        <option value={ResultadoTeste.APROVADO}>Aprovado</option>
                        <option value={ResultadoTeste.REPROVADO}>Reprovado</option>
                        <option value={ResultadoTeste.NAO_REALIZADO}>Não Realizado</option>
                    </select>
                </div>
            </div>

            {/* Tabela */}
            <div className="bg-zinc-100 border border-zinc-200 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-zinc-200">
                        <tr>
                            <th className="px-4 py-2">ID</th>
                            <th className="px-4 py-2">Tipo</th>
                            <th className="px-4 py-2">Resultado</th>
                            <th className="px-4 py-2 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtrados.map((t) => (
                            <tr key={t.id} className="border-t border-zinc-200 hover:bg-zinc-50">
                                <td className="px-4 py-2 font-mono text-sm">{t.id}</td>
                                <td className="px-4 py-2">{t.tipo}</td>
                                <td className="px-4 py-2">{t.resultado}</td>
                                <td className="px-4 py-2">
                                    <div className="flex gap-2 justify-end">
                                        <button onClick={() => abrirEdicao(t.id)} title="Editar teste" aria-label="Editar teste" className="p-2.5 rounded bg-amber-500 text-white hover:bg-amber-600 cursor-pointer flex items-center gap-2">
                                            <PencilSimpleIcon size={24} weight='bold' />
                                        </button>
                                        <button onClick={() => setDeleteId(t.id)} title="Excluir teste" aria-label="Excluir teste" className="p-2.5 rounded bg-red-500 text-white hover:bg-red-600 cursor-pointer flex items-center gap-2">
                                            <TrashIcon size={24} weight='bold' />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filtrados.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-zinc-600">Nenhum teste encontrado.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Formulário em Modal */}
            {formOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="w-[640px] bg-white rounded-lg shadow-lg border border-zinc-200 p-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xl font-semibold">{editId ? 'Editar Teste' : 'Novo Teste'}</h3>
                            <button aria-label="Fechar" onClick={() => { setFormOpen(false); resetForm(); }} className="p-2 hover:bg-zinc-100 rounded cursor-pointer">
                                <XIcon size={20} />
                            </button>
                        </div>
                        <form onSubmit={salvar} className="grid grid-cols-6 gap-3">
                            <div className="col-span-3 flex flex-col gap-1">
                                <label htmlFor="ts-tipo" className="text-sm font-semibold">Tipo</label>
                                <select id="ts-tipo" className="p-2 rounded border border-zinc-300 bg-white" value={form.tipo}
                                    onChange={(e) => setForm(v => ({ ...v, tipo: e.target.value as TipoTeste }))}
                                >
                                    <option value={TipoTeste.ELETRICO}>Elétrico</option>
                                    <option value={TipoTeste.HIDRAULICO}>Hidráulico</option>
                                    <option value={TipoTeste.AERODINAMICO}>Aerodinâmico</option>
                                </select>
                            </div>
                            <div className="col-span-3 flex flex-col gap-1">
                                <label htmlFor="ts-res" className="text-sm font-semibold">Resultado</label>
                                <select id="ts-res" className="p-2 rounded border border-zinc-300 bg-white" value={form.resultado}
                                    onChange={(e) => setForm(v => ({ ...v, resultado: e.target.value as ResultadoTeste }))}
                                >
                                    <option value={ResultadoTeste.NAO_REALIZADO}>Não Realizado</option>
                                    <option value={ResultadoTeste.APROVADO}>Aprovado</option>
                                    <option value={ResultadoTeste.REPROVADO}>Reprovado</option>
                                </select>
                            </div>
                            <div className="col-span-6 flex justify-end gap-2 mt-2">
                                <button type="button" onClick={() => { setFormOpen(false); resetForm(); }} className="px-4 py-2 rounded border border-zinc-300 bg-white hover:bg-zinc-50 cursor-pointer">Cancelar</button>
                                <button type="submit" className="px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 cursor-pointer">
                                    {editId ? 'Salvar alterações' : 'Cadastrar Teste'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Confirmar Exclusão de Teste */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="w-[520px] bg-white rounded-lg shadow-lg border border-zinc-200 p-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xl font-semibold">Excluir Teste</h3>
                            <button aria-label="Fechar" onClick={() => setDeleteId(null)} className="p-2 hover:bg-zinc-100 rounded cursor-pointer">
                                <XIcon size={20} />
                            </button>
                        </div>
                        <p className="text-zinc-700 mb-4">Tem certeza que deseja excluir o teste <span className="font-semibold">{deleteId}</span>?</p>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded border border-zinc-300 bg-white hover:bg-zinc-50 cursor-pointer">Cancelar</button>
                            <button onClick={() => excluir(deleteId)} className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 cursor-pointer">Excluir</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GerenciaTestes;