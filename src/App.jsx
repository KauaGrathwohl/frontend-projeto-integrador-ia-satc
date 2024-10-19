import React, { lazy } from 'react';
import { Outlet } from 'react-router-dom';
import { Col, Row } from 'antd';
import { useAuth } from './providers/AuthProvider';

const Menu = lazy(() => import('./components/MenuLateral'));

export default function App() {
  const auth = useAuth();

  if (!auth.user) {
    return null;
  }

  return (
    <Row>
      <Col span={24}>
        <Menu />
      </Col>
      <Col span={24}>
        <Outlet />
      </Col>
    </Row>
  );
}