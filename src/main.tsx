import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import './index.css'

// import Login from './pages/Login.tsx';

import { SidebarProvider } from './contexts/SidebarContext.tsx';
import HomeLayout from './components/HomeLayout.tsx';
import AeronaveLayout from './components/AeronaveLayout.tsx';

import DashboardAeronaves from './pages/DashboardAeronaves.tsx';
import DashboardEstatisticas from './pages/DashboardEstatisticas.tsx';
import DashboardFuncionarios from './pages/DashboardFuncionarios.tsx';

import GerenciaAeronave from './pages/aeronave/GerenciaAeronave.tsx';
import GerenciaEtapas from './pages/aeronave/GerenciaEtapas.tsx';
import GerenciaPecas from './pages/aeronave/GerenciaPecas.tsx';
import GerenciaTestes from './pages/aeronave/GerenciaTestes.tsx';

const router = createBrowserRouter([
  { path: '*', element: <div>404 Not Found</div> },
  // { path: '/', element: <Login /> },
  { 
    path: '/home',
    element: <HomeLayout />,
    children: [
      { index: true, element: <DashboardAeronaves />},
      { path: 'estatisticas', element: <DashboardEstatisticas /> },
      { path: 'funcionarios', element: <DashboardFuncionarios /> },
    ]
  },
  {
    path: '/aeronave/:aeronaveId',
    element: <AeronaveLayout />,
    children: [
      { index: true, element: <GerenciaAeronave /> },
      { path: 'etapas', element: <GerenciaEtapas /> },
      { path: 'pecas', element: <GerenciaPecas /> },
      { path: 'testes', element: <GerenciaTestes /> }
    ]
  }
]);

const root = document.getElementById('root');

createRoot(root!).render(
  <SidebarProvider>
    <RouterProvider router={router} />
  </SidebarProvider>
);