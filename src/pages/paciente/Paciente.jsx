import React, { useEffect, useState } from 'react';
import { Button, Col, Input, Modal, Row } from 'antd';
import Screen from '../../components/Screen';
import request from '../../utils/request';
import Item from './Item';
import Detalhes from './Detalhes';

export default function Paciente() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetch();
    }, 500);

    return () => clearTimeout(timeout);
  }, [filtro]);

  const fetch = () => {
    setLoading(true);

    request('/paciente', {
      method: 'GET',
      params: { filtro },
    }).then((data) => {
      setLoading(false);
      setData(data);
    }).catch((err) => {
      setLoading(false);
      Modal.error({
        title: 'Erro',
        content: err.message,
      });
    });
  }

  return (
    <Screen>
      <Row gutter={[10, 5]}
        justify='space-between'>
        <Col span={24}
          style={{
            marginTop: 10,
            marginBottom: 5,
            fontSize: 25,
            fontWeight: 'bold',
            opacity: 0.7,
          }}>
          Pacientes
        </Col>
        <Col xl={10}
          lg={12}
          md={14}
          xs={24}>
          <Input.Search size='large'
            value={filtro}
            loading={loading}
            onChange={(e) => setFiltro(e.target.value)} />
        </Col>
        <Col xl={4}
          lg={5}
          md={10}
          xs={24}>
          <Detalhes onClose={fetch}>
            <Button block
              loading={loading}
              type='primary'
              size='large'>
              Novo Paciente
            </Button>
          </Detalhes>
        </Col>
      </Row>
      <Row style={{ marginTop: 20 }}
        gutter={[0, 10]}>
        {data.map((item) => (
          <Col key={item.id}
            span={24}>
            <Item data={item}
              fetch={fetch} />
          </Col>
        ))}
      </Row>
    </Screen>
  );
}