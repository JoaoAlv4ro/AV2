import { EyeIcon, EyeClosedIcon} from '@phosphor-icons/react'
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

function Login() {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [erro, setErro] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErro('');
        const ok = await login(usuario.trim(), senha /*, { remember: true } */);
        if (ok) {
            navigate('/home');
        } else {
            setErro('Usuário ou senha incorretos');
        }
    };

    return (
        <section className="flex items-center justify-center w-screen h-screen">
            <form onSubmit={handleSubmit} className='min-w-[400px] bg-zinc-100 items-center flex flex-col gap-3 px-5 py-2.5 rounded-2xl drop-shadow-2xl border border-zinc-300'>
                <h1 className='text-4xl font-bold'>AEROCODE</h1>
                <p className=''>Entre para continuar</p>
                <div className='w-full flex flex-col items-center mb-2 gap-1'>
                    <span className='self-start text-sm font-bold'>Usuário</span>
                    <input
                        type="text"
                        placeholder="Usuário"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        className='w-full p-2 pl-4 bg-zinc-200 border border-zinc-300 rounded-lg'
                    />
                </div>

                <div className='w-full flex flex-col items-center mb-2 gap-1'>
                    <span className='self-start text-sm font-bold'>Senha</span>
                    <div className='w-full relative'>
                        <input
                            type={mostrarSenha ? 'text' : 'password'}
                            placeholder="Senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            className='w-full p-2 pl-4 pr-10 bg-zinc-200 border border-zinc-300 rounded-lg'
                        />
                        <button
                            type='button'
                            aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                            aria-pressed={mostrarSenha ? 'true' : 'false'}
                            onClick={() => setMostrarSenha((v) => !v)}
                            className='absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-800 p-1'
                        >
                            {mostrarSenha ? (
                                <EyeClosedIcon size={22} />
                            ) : (
                                <EyeIcon size={22} />
                            )}
                        </button>
                    </div>
                </div>
                {erro && <p className='text-red-500'>{erro}</p>}
                <button type="submit" className='w-full bg-blue-500 text-white font-bold px-4 py-2 rounded drop-shadow-2xl cursor-pointer hover:bg-blue-600 transition-colors'>
                    Acessar
                </button>

                <p className='text-[10px] text-sky-500'>Não possui uma conta? Contacte sua empresa (ou use dev/dev)</p>
            </form>
        </section>
    );
}

export default Login;