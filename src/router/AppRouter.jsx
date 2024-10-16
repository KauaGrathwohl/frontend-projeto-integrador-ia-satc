import React, { lazy } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import Login from '../pages/login/Login';

const PrivateRoute = lazy(() => import('../components/PrivateRoute'));
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const Paciente = lazy(() => import('../pages/paciente/Paciente'));
const Receita = lazy(() => import('../pages/receita/Receita'));

export default function AppRouter() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/pacientes' element={<Paciente />} />
            <Route path='/receitas' element={<Receita />} />
            <Route path='*' element={<Navigate to='/dashboard' replace />} />
          </Route>
          <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
      </BrowserRouter>
  );
}