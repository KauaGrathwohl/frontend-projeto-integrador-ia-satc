import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Input, Row, message } from 'antd';
import Screen from '../components/Screen';

export const usuarios = [
  { id: 1, nome: 'Kauã', login: 'kauã', senha: '20' },
  { id: 2, nome: 'Lucas', login: 'lucas', senha: '30' },
  { id: 3, nome: 'João', login: 'joão', senha: '40' },
  { id: 4, nome: 'Matheus', login: 'matheus', senha: '50' },
];

export default function Usuario() {
  const [data, setData] = useState(usuarios);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const filtered = usuarios.filter((el) => {
      if (typeof filtro != 'string') {
        return true;
      }

      return el.nome.toLowerCase().includes(filtro.trim().toLowerCase());
    });

    setData(filtered);
  }, [filtro]);

  const handleDelete = () => {
    message.success('Usuário deletado com sucesso!');
  }

  return (
    <Screen>
      <Row gutter={[10, 5]}>
        <Col span={24}>
          <Card>
            <Row gutter={[10, 5]}
              justify='space-between'>
              <Col xl={6}
                lg={7}
                md={12}
                sm={14}
                xs={24}>
                <Input value={filtro}
                  placeholder='Filtrar por nome...'
                  onChange={(e) => setFiltro(e.target.value)} />
              </Col>
              <Col xl={3}
                lg={4}
                md={6}
                sm={10}
                xs={24}>
                <Detalhes>
                  <Button block
                    type='primary'>
                    Cadastrar
                  </Button>
                </Detalhes>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={24}
          style={{ marginTop: 20 }}>
          <Row gutter={[10, 10]}>
            {data.map((el) => (
              <Col key={el.id}
                span={24}>
                <Item usuario={el}
                  onDelete={() => handleDelete(el)} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Screen>
  );
}