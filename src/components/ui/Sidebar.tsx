import { AirplaneTiltIcon, ChartBarIcon, UsersIcon } from "@phosphor-icons/react";
import { FactoryIcon, PuzzlePieceIcon, TestTubeIcon } from "@phosphor-icons/react";

interface SidebarProps {
  aeronaveModelo?: string;
}

function Sidebar({ aeronaveModelo }: SidebarProps) {
    // Sidebar Home (Sem aeronave selecionada)
    const HomeSidebar = () => (
        <aside className="w-64 h-full border-r border-zinc-400 flex flex-col justify-between px-4 py-3 flex-shrink-0">
            {/* Itens do Menu Home */}
            <div className="flex flex-col gap-1">
                <button className="flex items-center gap-3 p-0.5 rounded-lg hover:bg-zinc-200 w-full cursor-pointer" onClick={() => null}>
                    <AirplaneTiltIcon size={24} weight="regular" />
                    <span className="font-regular text-lg">Aeronaves</span>
                </button>
                <button className="flex items-center gap-3 p-0.5 rounded-lg hover:bg-zinc-200 w-full cursor-pointer" onClick={() => null}>
                    <ChartBarIcon size={24} weight="regular" />
                    <span className="font-regular text-lg">Estatísticas</span>
                </button>
                <button className="flex items-center gap-3 p-0.5 rounded-lg hover:bg-zinc-200 w-full cursor-pointer" onClick={() => null}>
                    <UsersIcon size={24} weight="regular" />
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
        <aside className="w-64 h-full border-r border-zinc-400 flex flex-col justify-between px-4 py-3 flex-shrink-0">
            {/* Itens do Menu Home */}
            <div className="flex flex-col gap-1">
                <button className="flex items-center gap-3 p-0.5 rounded-lg hover:bg-zinc-200 w-full cursor-pointer" onClick={() => null}>
                    <AirplaneTiltIcon size={24} weight="regular" />
                    <span className="font-regular text-lg">Aeronave</span>
                </button>
                <button className="flex items-center gap-3 p-0.5 rounded-lg hover:bg-zinc-200 w-full cursor-pointer" onClick={() => null}>
                    <FactoryIcon size={24} weight="regular" />
                    <span className="font-regular text-lg">Etapas</span>
                </button>
                <button className="flex items-center gap-3 p-0.5 rounded-lg hover:bg-zinc-200 w-full cursor-pointer" onClick={() => null}>
                    <PuzzlePieceIcon size={24} weight="regular" />
                    <span className="font-regular text-lg">Peças</span>
                </button>
                <button className="flex items-center gap-3 p-0.5 rounded-lg hover:bg-zinc-200 w-full cursor-pointer" onClick={() => null}>
                    <TestTubeIcon size={24} weight="regular" />
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