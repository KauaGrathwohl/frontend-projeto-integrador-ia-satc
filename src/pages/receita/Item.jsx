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
            Calorias: {data.calorias} kcal
          </Col>
          &nbsp;|&nbsp;
          <Col>
            Carboidratos: {data.carboidratos}g
          </Col>
          &nbsp;|&nbsp;
          <Col>
            Gordura: {data.gordura}g
          </Col>
          &nbsp;|&nbsp;
          <Col>
            Proteína: {data.proteina}g
          </Col>
        </Row>
      </Card>
    </Detalhes>
  );
}