import React from 'react';
import { Card, Col, Row } from 'antd';

export default function Item({ data, fetch }) {

  return (
    <Card>
      <Row gutter={[10, 5]}>
        <Col span={24}
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            opacity: 0.8,
          }}>
          {data.nome}
        </Col>
        <Col>
          Data Inicial: {data.dtInicioMeta ? new Date(data.dtInicioMeta).toLocaleDateString() : ''}
        </Col>
      </Row>
    </Card>
  );
}