import React, { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

const Menu = lazy(() => import('../menu/Menu'));

const Painel = () => {
  return (
    <React.Fragment>
      <Menu />
      <Suspense fallback='Carregando...'>
        <Outlet />
      </Suspense>
    </React.Fragment>
  );
}

export default Painel;