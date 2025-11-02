import { Outlet } from 'react-router';
import Navbar from './ui/Navbar';
import Sidebar from './ui/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';

function HomeLayout() {
    const { isOpen } = useSidebar();

    return (
        <div className="flex flex-col h-screen w-screen">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
                    <Sidebar />
                </div>
                
                {/* Conteúdo Principal (Dashboard) */}
                <main className="flex flex-col gap-6 flex-1 overflow-auto px-5 py-3">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default HomeLayout;