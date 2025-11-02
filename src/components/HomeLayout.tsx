import { Outlet } from 'react-router';
import Navbar from './ui/Navbar';
import Sidebar from './ui/Sidebar';

function HomeLayout() {
    return (
        <div className="flex flex-col h-screen w-screen">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex flex-col gap-6 flex-1 overflow-auto px-5 py-3">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default HomeLayout;