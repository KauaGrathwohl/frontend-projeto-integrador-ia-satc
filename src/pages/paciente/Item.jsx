import React from 'react';
import { Card, Col, Row } from 'antd';
import Detalhes from './Detalhes';

export default function Item({ data, fetch }) {

  return (
    <Detalhes id={data.id}
      onClose={fetch}>
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
            Objetivo: {data.objetivo}
          </Col>
          &nbsp;|&nbsp;
          <Col>
            Peso: {data.peso} KG
          </Col>
          &nbsp;|&nbsp;
          <Col>
            Altura: {data.altura} cm
          </Col>
        </Row>
      </Card>
    </Detalhes>
  );
}