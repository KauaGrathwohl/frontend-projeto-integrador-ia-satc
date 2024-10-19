import React, { useState } from 'react';
import { Row, Modal, Form, Spin, Button, Col, Input, InputNumber, message, Table } from 'antd';
import DatePicker from '../../components/DatePicker';
import request from '../../utils/request';

export default function Detalhes({ pacienteId, children }) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const columns = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
    },
    {
      title: 'Data Início',
      dataIndex: 'dtInicioMeta',
      key: 'dtInicioMeta',
      width: 110,
      render: (value) => value ? new Date(value).toLocaleDateString() : '',
    },
    {
      title: 'Data Final',
      dataIndex: 'dtFinalMeta',
      key: 'dtFinalMeta',
      width: 110,
      render: (value) => value ? new Date(value).toLocaleDateString() : '',
    },
  ];

  const modal = (e) => {
    e.stopPropagation();
    setVisible(true);

    if (pacienteId) {
      fetch();
    }
  }

  const fetch = () => {
    if (!pacienteId) {
      return;
    }

    setLoading(true);

    request(`/plano-meta/${pacienteId}`, {
      method: 'GET',
    }).then((data) => {
      setLoading(false);
      setData(data);
    }).catch((err) => {
      setLoading(false);
      Modal.error({
        title: 'Erro!',
        content: err,
      });
    });
  }

  const handleSubmit = (values) => {
    setLoading(true);

    if (!pacienteId) {
      message.error('Paciente não informado');

      return;
    }

    request(`/plano-meta/${pacienteId}`, {
      method: 'POST',
      body: { ...values },
    }).then(() => {
      setLoading(false);
      form.resetFields();
      fetch();
    }).catch((err) => {
      setLoading(false);
      Modal.error({
        title: 'Erro!',
        content: err,
      });
    });
  }

  const handleClear = () => {
    form.resetFields();
    setLoading(false);
    setVisible(false);
    setData([]);
  }

  return (
    <span>
      <span onClick={modal}
        style={{ cursor: 'pointer' }}>
        {children}
      </span>
      <Modal open={visible}
        title='Cadastro do Plano'
        okText='Salvar'
        centered
        destroyOnClose
        onCancel={handleClear}
        onOk={form.submit}
        width={1000}>
        <Form form={form}
          layout='vertical'
          onFinish={handleSubmit}>
          <Spin spinning={loading}>
            <Row gutter={[10, 5]}>
              <Col span={18}>
                <Form.Item name='nomePlano'
                  label='Nome do Plano'
                  rules={[{ required: true, message: 'Campo obrigatório' }]}>
                  <Input maxLength={100} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name='dtInicial'
                  label='Data Inicial'
                  rules={[{ required: true, message: 'Campo obrigatório' }]}>
                  <DatePicker />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name='qtdDiariaCalorias'
                  label='Qtd. Diária Calorias'
                  rules={[{ required: true, message: 'Campo obrigatório' }]}>
                  <InputNumber min={0}
                    style={{ width: '100%' }}
                    precision={2}
                    controls={false}
                    decimalSeparator=',' />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name='qtdDiariaCarboidratos'
                  label='Qtd. Diária Carboidratos'
                  rules={[{ required: true, message: 'Campo obrigatório' }]}>
                  <InputNumber min={0}
                    style={{ width: '100%' }}
                    precision={2}
                    controls={false}
                    decimalSeparator=',' />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name='qtdDiariaGordura'
                  label='Qtd. Diária Gordura'
                  rules={[{ required: true, message: 'Campo obrigatório' }]}>
                  <InputNumber min={0}
                    style={{ width: '100%' }}
                    precision={2}
                    controls={false}
                    decimalSeparator=',' />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name='qtdDiariaProteina'
                  label='Qtd. Diária Proteínas'
                  rules={[{ required: true, message: 'Campo obrigatório' }]}>
                  <InputNumber min={0}
                    style={{ width: '100%' }}
                    precision={2}
                    controls={false}
                    decimalSeparator=',' />
                </Form.Item>
              </Col>
              <Col span={24}
                style={{ marginTop: 10 }}>
                <Table size='small'
                  columns={columns}
                  dataSource={data}
                  pagination={false}
                  rowKey='id' />
              </Col>
            </Row>
          </Spin>
        </Form>
      </Modal>
    </span>
  );
}