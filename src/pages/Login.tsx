import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

function Login() {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (login(usuario, senha)) {
            navigate('/home');
        } else {
            setErro('Usuário ou senha incorretos');
        }
    };

    return (
        <body className="flex items-center justify-center w-screen h-screen">
            <form className='bg-zinc-100 items-center flex flex-col gap-3 px-5 py-2.5 rounded-2xl drop-shadow-2xl'>
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
                    <input
                        type="password"
                        placeholder="Senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className='w-full p-2 pl-4 bg-zinc-200 border border-zinc-300 rounded-lg'
                    />
                </div>
                {erro && <p className='text-red-500'>{erro}</p>}
                <button type="submit" className='w-full bg-sky-500 text-white px-4 py-2 rounded'>
                    Acessar
                </button>

                <p className='text-sm'>Não possui uma conta? Contacte sua empresa</p>
            </form>
        </body>
    );
}

export default Login;