import { AirplaneTiltIcon, ChartBarIcon, UsersIcon } from "@phosphor-icons/react";
import { FactoryIcon, PuzzlePieceIcon, TestTubeIcon } from "@phosphor-icons/react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router";
interface SidebarProps {
    aeronaveModelo?: string;
}

function Sidebar({ aeronaveModelo }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path: string) => {
        if (path === '/home' && location.pathname === '/home') return true;
        if (path === '/home/funcionarios' && location.pathname.includes('/funcionarios')) return true;
        if (path === '/home/estatisticas' && location.pathname.includes('/estatisticas')) return true;
        
        if (path === '/aeronave' && location.pathname.startsWith('/aeronave') && location.pathname.split('/').length === 3) return true;
        if (path === '/aeronave/etapas' && location.pathname.includes('/etapas')) return true;
        if (path === '/aeronave/pecas' && location.pathname.includes('/pecas')) return true;
        if (path === '/aeronave/testes' && location.pathname.includes('/testes')) return true;
        
        return false;
    }

    const getButtonClass = (path: string) => {
        const baseClass = "flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-200 w-full cursor-pointer";
        const activeClass = "flex items-center gap-3 p-2 w-full rounded-lg bg-sky-100 text-sky-500 font-semibold underline";
        return isActive(path) ? `${activeClass}` : baseClass;
    }

    // Sidebar Home (Sem aeronave selecionada)
    const HomeSidebar = () => (
        <aside className="w-64 h-full border-r border-zinc-400 flex flex-col justify-between px-4 py-3 shrink-0">
            {/* Itens do Menu Home */}
            <div className="flex flex-col gap-1">
                <button className={getButtonClass('/home')} onClick={() => navigate('/home')}>
                    <AirplaneTiltIcon size={24} weight={isActive('/home') ? "fill" : "regular"} />
                    <span className="font-regular text-lg">Aeronaves</span>
                </button>
                <button className={getButtonClass('/home/estatisticas')} onClick={() => navigate('/home/estatisticas')}>
                    <ChartBarIcon size={24} weight={isActive('/home/estatisticas') ? "fill" : "regular"} />
                    <span className="font-regular text-lg">Estatísticas</span>
                </button>
                <button className={getButtonClass('/home/funcionarios')} onClick={() => navigate('/home/funcionarios')}>
                    <UsersIcon size={24} weight={isActive('/home/funcionarios') ? "fill" : "regular"} />
                    <span className="font-regular text-lg">Funcionários</span>
                </button>
            </div>
            
            {/* Logotipo */}
            <div className="flex flex-col items-center gap-2 mt-4">
                <div className="w-full h-[1px] bg-zinc-400" />
                <h1 className="font-extrabold text-2xl">AEROCODE</h1>
            </div>
        </aside>
    );

    // Sidebar Aeronave Selecionada
    const AeronaveSidebar = () => (
        <aside className="w-64 h-full border-r border-zinc-400 flex flex-col justify-between px-4 py-3 shrink-0">
            {/* Itens do Menu Home */}
            <div className="flex flex-col gap-1">
                <button className={getButtonClass('/aeronave')} onClick={() => navigate('/aeronave/:aeronaveid')}>
                    <AirplaneTiltIcon size={24} weight={isActive('/aeronave') ? "fill" : "regular"} />
                    <span className="font-regular text-lg">Aeronave</span>
                </button>
                <button className={getButtonClass('/aeronave/etapas')} onClick={() => navigate('/aeronave/:aeronaveid/etapas')}>
                    <FactoryIcon size={24} weight={isActive('/aeronave/etapas') ? "fill" : "regular"} />
                    <span className="font-regular text-lg">Etapas</span>
                </button>
                <button className={getButtonClass('/aeronave/pecas')} onClick={() => navigate('/aeronave/:aeronaveid/pecas')}>
                    <PuzzlePieceIcon size={24} weight={isActive('/aeronave/pecas') ? "fill" : "regular"} />
                    <span className="font-regular text-lg">Peças</span>
                </button>
                <button className={getButtonClass('/aeronave/testes')} onClick={() => navigate('/aeronave/:aeronaveid/testes')}>
                    <TestTubeIcon size={24} weight={isActive('/aeronave/testes') ? "fill" : "regular"} />
                    <span className="font-regular text-lg">Testes</span>
                </button>
            </div>
            
            {/* Logotipo */}
            <div className="flex flex-col items-center gap-2 mt-4">
                <div className="w-full h-[1px] bg-zinc-400" />
                <h1 className="font-extrabold text-2xl">AEROCODE</h1>
            </div>
        </aside>
    );

    return aeronaveModelo ? AeronaveSidebar() : HomeSidebar();
}
export default Sidebar;