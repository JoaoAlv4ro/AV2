import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import './index.css'

import HomeLayout from './components/HomeLayout.tsx';
import AeronaveLayout from './components/AeronaveLayout.tsx';

import DashboardAeronaves from './pages/DashboardAeronaves.tsx';


const router = createBrowserRouter([
  { path: '*', element: <div>404 Not Found</div> },
  // { path: '/', element: <Login /> },
  { 
    path: '/home',
    element: <HomeLayout />,
    children: [
      { index: true, element: <DashboardAeronaves />},
    ]
  },
  {
    path: '/aeronave/:aeronaveId',
    element: <AeronaveLayout />,
    children: [
      // { index: true, element: <GerenciaAeronave /> },
      // { path: 'etapas', element: <GerenciaEtapa /> }
    ]
  }
]);

const root = document.getElementById('root');

createRoot(root!).render(
  <RouterProvider router={router} />
);