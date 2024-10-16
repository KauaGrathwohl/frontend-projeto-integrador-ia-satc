import React from 'react';
import { Row } from 'antd';
import { useAuth } from '../../providers/AuthProvider';
import { useTitle } from '../../hooks/useTitle';

export default function Dashboard() {
  const auth = useAuth();

  useTitle('Dashboard');

  if (!auth.isAuthenticated()) {
    return null;
  }

  return (
    <Row>
    </Row>
  );
}