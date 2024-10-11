import React, { lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const ProtectedRoute = lazy(() => import('./ProtectedRoute'));
const Painel = lazy(() => import('./Painel'));
const Login = lazy(() => import('../login/Login'));
const Dashboard = lazy(() => import('../dashboard/Dashboard'));

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Painel />}>
            <Route index element={<Dashboard />} />
            <Route path='/dashboard' element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}