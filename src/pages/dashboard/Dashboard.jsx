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
    <Row gutter={[10, 5]}
      justify='center'
      align='middle'
      style={{ marginTop: '10%' }}>
      {/* <Col span={24}
        style={{
          fontSize: 70,
          textAlign: 'center',
          color: '#65BE8E'
        }}>
        Bem vindo!
      </Col>
      <Col style={{ fontSize: 30, marginRight: 25, color: '#65BE8E' }}>
        <a onClick={() => navigate('/app/pacientes')}>Pacientes</a>
      </Col>
      <Col style={{ fontSize: 30, marginLeft: 25, color: '#65BE8E' }}>
        <a onClick={() => navigate('/app/receitas')}>Receitas</a>
      </Col> */}
    </Row>
  );
}