import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { PencilSimpleIcon, TrashIcon, PlusIcon } from '@phosphor-icons/react';
import { useFuncionarios } from '../contexts/data/FuncionarioContext';
import { NivelPermissao } from '../types/enums';

type FormState = {
    id?: string;
    nome: string;
    telefone: string;
    endereco: string;
    usuario: string;
    senha: string;
    nivelPermissao: NivelPermissao;
};

function emptyForm(): FormState {
    return { nome: '', telefone: '', endereco: '', usuario: '', senha: '', nivelPermissao: NivelPermissao.OPERADOR };
}

function DashboardFuncionarios() {
    const { funcionarios, loading, createFuncionario, updateFuncionario, deleteFuncionario } = useFuncionarios();

    const [formOpen, setFormOpen] = useState(false);
    const [form, setForm] = useState<FormState>(emptyForm());
    const isEdit = useMemo(() => Boolean(form.id), [form.id]);

    useEffect(() => {
        if (!formOpen) setForm(emptyForm());
    }, [formOpen]);

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const payload = {
            nome: form.nome.trim(),
            telefone: form.telefone.trim(),
            endereco: form.endereco.trim(),
            usuario: form.usuario.trim(),
            senha: form.senha,
            nivelPermissao: form.nivelPermissao,
        };
        if (isEdit && form.id) {
            await updateFuncionario(form.id, payload);
        } else {
            await createFuncionario(payload);
        }
        setFormOpen(false);
    };

    const startEdit = (id: string) => {
        const f = funcionarios.find(x => x.id === id);
        if (!f) return;
        setForm({ ...f });
        setFormOpen(true);
    };

    const remove = async (id: string) => {
        if (confirm('Deseja remover este funcionário?')) {
            await deleteFuncionario(id);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="w-full flex justify-between items-center">
                <h2 className="text-3xl font-semibold">Funcionários</h2>
                <button
                    onClick={() => { setForm(emptyForm()); setFormOpen(true); }}
                    className="flex bg-blue-500 text-white p-4  rounded gap-2 items-center font-semibold hover:bg-blue-600 cursor-pointer"
                >
                    <PlusIcon size={22} weight="bold" />
                    Adicionar Funcionário
                </button>
            </div>

            {/* Formulário */}
            {formOpen && (
                <form onSubmit={submit} className="bg-zinc-100 border border-zinc-200 rounded-lg p-4 grid grid-cols-6 gap-3">
                                <div className="col-span-2 flex flex-col gap-1">
                                    <label htmlFor="func-nome" className="text-sm font-semibold">Nome</label>
                                    <input id="func-nome" placeholder="Nome" className="p-2 rounded border border-zinc-300 bg-white" value={form.nome}
                            onChange={(e) => setForm(v => ({ ...v, nome: e.target.value }))} required />
                    </div>
                    <div className="col-span-2 flex flex-col gap-1">
                                    <label htmlFor="func-telefone" className="text-sm font-semibold">Telefone</label>
                                    <input id="func-telefone" placeholder="(00) 90000-0000" className="p-2 rounded border border-zinc-300 bg-white" value={form.telefone}
                            onChange={(e) => setForm(v => ({ ...v, telefone: e.target.value }))} required />
                    </div>
                    <div className="col-span-2 flex flex-col gap-1">
                                    <label htmlFor="func-endereco" className="text-sm font-semibold">Endereço</label>
                                    <input id="func-endereco" placeholder="Endereço" className="p-2 rounded border border-zinc-300 bg-white" value={form.endereco}
                            onChange={(e) => setForm(v => ({ ...v, endereco: e.target.value }))} required />
                    </div>
                    <div className="col-span-2 flex flex-col gap-1">
                                    <label htmlFor="func-usuario" className="text-sm font-semibold">Usuário</label>
                                    <input id="func-usuario" placeholder="Usuário" className="p-2 rounded border border-zinc-300 bg-white" value={form.usuario}
                            onChange={(e) => setForm(v => ({ ...v, usuario: e.target.value }))} required />
                    </div>
                    <div className="col-span-2 flex flex-col gap-1">
                                    <label htmlFor="func-senha" className="text-sm font-semibold">Senha</label>
                                    <input id="func-senha" placeholder="Senha" type="password" className="p-2 rounded border border-zinc-300 bg-white" value={form.senha}
                            onChange={(e) => setForm(v => ({ ...v, senha: e.target.value }))} required />
                    </div>
                    <div className="col-span-2 flex flex-col gap-1">
                                    <label htmlFor="func-nivel" className="text-sm font-semibold">Nível de Permissão</label>
                                    <select id="func-nivel" className="p-2 rounded border border-zinc-300 bg-white" value={form.nivelPermissao}
                            onChange={(e) => setForm(v => ({ ...v, nivelPermissao: e.target.value as NivelPermissao }))}
                        >
                            <option value="Administrador">Administrador</option>
                            <option value="Engenheiro">Engenheiro</option>
                            <option value="Operador">Operador</option>
                        </select>
                    </div>

                    <div className="col-span-6 flex gap-2 justify-end mt-2">
                        <button type="button" onClick={() => setFormOpen(false)}
                            className="px-4 py-2 rounded border border-zinc-300 bg-white hover:bg-zinc-50">Cancelar</button>
                        <button type="submit"
                            className="px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600">
                            {isEdit ? 'Salvar alterações' : 'Cadastrar'}
                        </button>
                    </div>
                </form>
            )}

            {/* Estado de carregamento */}
            {loading && (
                <div className="text-zinc-600">Carregando...</div>
            )}

            {/* Tabela */}
            <div className="bg-zinc-100 border border-zinc-200 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-zinc-200">
                        <tr>
                            <th className="px-4 py-2">Nome</th>
                            <th className="px-4 py-2">Usuário</th>
                            <th className="px-4 py-2">Telefone</th>
                            <th className="px-4 py-2">Endereço</th>
                            <th className="px-4 py-2">Permissão</th>
                            <th className="px-4 py-2 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {funcionarios.map((f) => (
                            <tr key={f.id} className="border-t border-zinc-200 hover:bg-zinc-50">
                                <td className="px-4 py-2 font-medium">{f.nome}</td>
                                <td className="px-4 py-2">{f.usuario}</td>
                                <td className="px-4 py-2">{f.telefone}</td>
                                <td className="px-4 py-2">{f.endereco}</td>
                                <td className="px-4 py-2">{f.nivelPermissao}</td>
                                <td className="px-4 py-2">
                                    <div className="flex gap-2 justify-end">
                                        <button onClick={() => startEdit(f.id)} title="Editar funcionário" aria-label="Editar funcionário"
                                            className="p-2.5 rounded bg-amber-500 text-white hover:bg-amber-600 cursor-pointer flex items-center gap-2">
                                            <PencilSimpleIcon size={24} />
                                        </button>
                                        <button onClick={() => remove(f.id)} title="Remover funcionário" aria-label="Remover funcionário"
                                            className="p-2.5 rounded bg-red-500 text-white hover:bg-red-600 cursor-pointer flex items-center gap-2">
                                            <TrashIcon size={24} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {funcionarios.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-zinc-600">Nenhum funcionário cadastrado.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DashboardFuncionarios;
