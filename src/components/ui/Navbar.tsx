import { SidebarIcon, HouseIcon, GearSixIcon, SignOutIcon } from "@phosphor-icons/react";
import { useNavigate } from "react-router";
import { useSidebar } from "../../contexts/SidebarContext";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

interface NavbarProps {
    aeronaveModelo?: string;
}

function Navbar({ aeronaveModelo }: NavbarProps) {
    const navigate = useNavigate();
    const { toggle } = useSidebar();
    const { logout } = useAuth();

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const toggleMenu = () => setMenuOpen((v) => !v);

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate("/");
    };

    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (!menuRef.current) return;
            const target = e.target as Node;
            if (!menuRef.current.contains(target)) setMenuOpen(false);
        }
        function onEsc(e: KeyboardEvent) {
            if (e.key === "Escape") setMenuOpen(false);
        }
        document.addEventListener("mousedown", onDocClick);
        document.addEventListener("keydown", onEsc);
        return () => {
            document.removeEventListener("mousedown", onDocClick);
            document.removeEventListener("keydown", onEsc);
        };
    }, []);

    return (
        <nav className="w-full border-b border-zinc-400 px-4 py-3 flex items-center">
            <div className="flex items-center justify-between w-full">
                {/* Sidebar Toggle e Home Button */}
                <div className="flex gap-3 items-center">
                    <button className="rounded-sm cursor-pointer" onClick={toggle} title="Toggle Sidebar">
                        <SidebarIcon size={32} weight="fill" className="hover:bg-zinc-200 rounded-sm p-1" />
                    </button>
                    <button className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
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
                <div ref={menuRef} className="relative flex gap-3 items-center">
                    <button
                        className="rounded-sm p-1 hover:bg-zinc-200 cursor-pointer"
                        onClick={toggleMenu}
                        aria-haspopup="menu"
                        title="Configurações"
                    >
                        <GearSixIcon size={24} weight="fill" />
                    </button>
                    <button className="" onClick={() => null}>
                        [User Image]
                    </button>

                    {menuOpen && (
                        <div
                            role="menu"
                            className="absolute right-0 top-full mt-2 w-44 bg-white border border-zinc-200 rounded-md shadow-lg py-1 z-50"
                        >
                            <button
                                role="menuitem"
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-3 py-2 text-left text-zinc-800 hover:bg-zinc-100 cursor-pointer"
                            >
                                <SignOutIcon size={18} />
                                Sair
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
export default Navbar;