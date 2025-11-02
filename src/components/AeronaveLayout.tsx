import { Outlet, useParams } from 'react-router';
import Navbar from './ui/Navbar';
import Sidebar from './ui/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';

function AeronaveLayout() {
    const { aeronaveId } = useParams();
    const { isOpen } = useSidebar();

    return (
        <div className="flex flex-col h-screen w-screen">
            <Navbar aeronaveModelo={aeronaveId} />
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar com transição suave */}
                <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
                    <Sidebar aeronaveModelo={aeronaveId} />
                </div>
                
                {/* Conteúdo principal que se expande */}
                <main className="flex flex-col gap-6 flex-1 overflow-auto px-5 py-3">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AeronaveLayout;