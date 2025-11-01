import { SidebarIcon, HouseIcon, GearSixIcon } from "@phosphor-icons/react";

interface NavbarProps {
    aeronaveModelo?: string;
}

function Navbar({ aeronaveModelo }: NavbarProps) {
    return (
        <nav className="w-full border-b border-zinc-400 px-4 py-3 flex items-center">
            <div className="flex items-center justify-between w-full">
                {/* Sidebar Toggle e Home Button */}
                <div className="flex gap-3 items-center">
                    <button className="rounded-sm cursor-pointer" onClick={() => null}>
                        <SidebarIcon size={32} weight="fill" className="hover:bg-zinc-200 rounded-sm p-1" />
                    </button>
                    <button className="flex items-center gap-2 cursor-pointer" onClick={() => null}>
                        <HouseIcon size={32} weight="fill" className="bg-zinc-300 rounded-sm p-1 hover:bg-zinc-200" />
                        <h3 className="font-semibold text-2xl">Home</h3>
                    </button>
                </div>
                {/* Aeronave Selecionada */}
                {aeronaveModelo && (
                    <div className="flex items-center justify-center">
                        <h2 className="text-2xl font-normal text-zinc-950">
                            Aeronave: <span className="font-semibold">{aeronaveModelo}</span>
                        </h2>
                    </div>
                )}

                {/* Configurações e Perfil do Usuário */}
                <div className="flex gap-3 items-center">
                    <button className="rounded-sm p-1 hover:bg-zinc-200 cursor-pointer" onClick={() => null}>
                        <GearSixIcon size={24} weight="fill" />
                    </button>
                    <button className="" onClick={() => null}>
                        [User Image]
                    </button>
                </div>
            </div>
        </nav>
    )
}
export default Navbar;