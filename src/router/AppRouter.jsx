import React, { lazy } from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';

import Login from '../pages/login/Login';

const PrivateRoute = lazy(() => import('../components/PrivateRoute'));
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const Paciente = lazy(() => import('../pages/paciente/Paciente'));
const PlanoMeta = lazy(() => import('../pages/planoMeta/PlanoMeta'));
const ListagemPlanosPage = lazy(() => import('../pages/planoMeta/ListagemPlanosPage')); // Adicionando o import
const Receita = lazy(() => import('../pages/receita/Receita'));

export default function AppRouter() {
  return (
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path='/entrar' element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path='app' element={<Outlet />}>
              <Route index element={<Dashboard />} />
              <Route path='dashboard' element={<Dashboard />} />
              <Route path='pacientes' element={<Paciente />} />
              <Route path='plano-meta' element={<PlanoMeta />} />
              <Route path='plano-meta/listagem' element={<ListagemPlanosPage />} /> {/* Adicionando a rota da ListagemPlanosPage */}
              <Route path='receitas' element={<Receita />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
  );
}