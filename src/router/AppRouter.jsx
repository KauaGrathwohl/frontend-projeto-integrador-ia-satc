import React, { lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Login from '../pages/login/Login';

const PrivateRoute = lazy(() => import('../components/PrivateRoute'));
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const Paciente = lazy(() => import('../pages/paciente/Paciente'));
const Receita = lazy(() => import('../pages/receita/Receita'));

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index
          element={<Login />} />
        <Route path='/entrar'
          element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route index
            element={<Dashboard />} />
          <Route path='/dashboard'
            element={<Dashboard />} />
          <Route path='/pacientes'
            element={<Paciente />} />
          <Route path='/receitas'
            element={<Receita />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}