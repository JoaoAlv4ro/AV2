import { Outlet, useParams } from 'react-router';
import Navbar from './ui/Navbar';
import Sidebar from './ui/Sidebar';

function AeronaveLayout() {
    const { aeronaveId } = useParams();

    return (
        <div className="flex flex-col h-screen w-screen">
            <Navbar aeronaveModelo={aeronaveId} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar aeronaveModelo={aeronaveId} />
                <main className="flex flex-col gap-6 flex-1 overflow-auto px-5 py-3">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AeronaveLayout;