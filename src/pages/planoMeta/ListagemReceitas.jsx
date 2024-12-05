import React from 'react';
import { Col, Row, Table } from 'antd';

export default function ListagemReceitas({ data }) {
  if (!data) {
    return null;
  }

  const { cafeDaManha, almoco, cafeDaTarde, jantar } = data;
  const isSomeValid = [
    cafeDaManha?.receitas,
    almoco?.receitas,
    cafeDaTarde?.receitas,
    jantar?.receitas,
  ].some((item) => Array.isArray(item) && item.length > 0);

  if (!isSomeValid) {
    return (
      <Row gutter={[10, 5]}
        justify='center'>
        <Col style={{ fontSize: 25, opacity: 0.8, padding: '50px 0px' }}>
          <b>Nenhuma receita encontrada</b>
        </Col>
      </Row>
    );
  }

  const formatTitle = (text) => {
    return (
      <b style={{ fontSize: 20, opacity: 0.85 }}>
        {text}
      </b>
    );
  }

  const formatValor = (valor) => {
    valor = Number(valor);

    if (isNaN(valor)) {
      return '0 g';
    }

    valor = valor * 1000;

    //Arredonda pra 2 casas decimais
    valor = Math.round(valor * 100) / 100;

    return `${valor} g`;
  }

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
    },
    {
      title: 'Calorias',
      dataIndex: 'calorias',
      key: 'calorias',
      width: 150,
      render: formatValor,
    },
    {
      title: 'Carboidratos',
      dataIndex: 'carboidratos',
      key: 'carboidratos',
      width: 150,
      render: formatValor,
    },
    {
      title: 'Gorduras',
      dataIndex: 'gordura',
      key: 'gordura',
      width: 150,
      render: formatValor,
    },
    {
      title: 'Proteinas',
      dataIndex: 'proteinas',
      key: 'proteinas',
      width: 150,
      render: formatValor,
    },
  ];

  return (
    <Row gutter={[10, 20]}>
      <Col span={24}>
        <Table size='small'
          title={() => formatTitle('Café da Manhã')}
          columns={columns}
          pagination={false}
          rowKey='id'
          dataSource={cafeDaManha?.receitas} />
      </Col>
      <Col span={24}>
        <Table size='small'
          title={() => formatTitle('Almoço')}
          columns={columns}
          pagination={false}
          rowKey='id'
          dataSource={almoco?.receitas} />
      </Col>
      <Col span={24}>
        <Table size='small'
          title={() => formatTitle('Café da Tarde')}
          columns={columns}
          pagination={false}
          rowKey='id'
          dataSource={cafeDaTarde?.receitas} />
      </Col>
      <Col span={24}>
        <Table size='small'
          title={() => formatTitle('Jantar')}
          columns={columns}
          pagination={false}
          rowKey='id'
          dataSource={jantar?.receitas} />
      </Col>
    </Row>
  );
}