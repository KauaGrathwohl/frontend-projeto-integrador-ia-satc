import React from 'react';
import { Button, Card, Col, Row } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';
import PlanoMetaDetalhes from '../planoMeta/Detalhes';
import Detalhes from './Detalhes';

export default function Item({ data, fetch }) {

  return (
    <Card>
      <Row gutter={[10, 5]}
        align='middle'>
        <Col span={23}>
          <Detalhes id={data.id}
            onClose={fetch}>
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
          </Detalhes>
        </Col>
        <Col span={1}>
          <PlanoMetaDetalhes pacienteId={data.id}>
            <Button icon={<UnorderedListOutlined />} />
          </PlanoMetaDetalhes>
        </Col>
      </Row>
    </Card>
  );
}