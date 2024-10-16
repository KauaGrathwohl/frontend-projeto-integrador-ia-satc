import React, { useState } from 'react';
import { Row, Modal, Form, Spin, Col, Input, InputNumber, Table, Button, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import request from '../../utils/request';
import DatePicker from '../../components/DatePicker';
import AdicionarPlano from './AdicionarPlano';

export default function Detalhes({ id, onClose, children }) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [planos, setPlanos] = useState([]);
  const [form] = Form.useForm();
  const columns = [
    {
      title: 'Nome',
      key: 'nome',
      dataIndex: 'nome',
    },
    {
      title: 'Início',
      key: 'dhInicio',
      dataIndex: 'dhInicio',
      width: 110,
      render: (value) => value ? new Date(value).toLocaleDateString() : null,
    },
    {
      title: '',
      key: 'nome',
      dataIndex: 'nome',
      width: 35,
      render: (value) => (
        <Button danger
          icon={<DeleteOutlined />}
          onClick={() => removePlano(value)} />
      ),
    },
  ];

  const modal = (e) => {
    e.stopPropagation();
    setVisible(true);

    if (id) {
      fetch();
    }
  }

  const fetch = () => {
    if (!id) {
      return;
    }

    setLoading(true);

    request(`/paciente/${id}`, {
      method: 'GET',
    }).then(({ planos, ...data }) => {
      setLoading(false);
      setPlanos(planos || []);
      form.setFieldsValue(data);
    }).catch((err) => {
      setLoading(false);
      Modal.error({
        title: 'Erro!',
        content: err.message,
      });
    });
  }

  const handleSubmit = (values) => {
    setLoading(true);

    let url = '/paciente';

    if (id) {
      url += `/${id}`;
    }

    request(url, {
      method: id ? 'PUT' : 'POST',
      body: { ...values, planos, id },
    }).then(() => {
      setLoading(false);
      handleClear();
      onClose?.();
    }).catch((err) => {
      setLoading(false);
      Modal.error({
        title: 'Erro!',
        content: err.message,
      });
    });
  }

  const handleClear = () => {
    form.resetFields();
    setLoading(false);
    setVisible(false);
    setPlanos([]);
  }

  const addPlano = (value) => {
    if (planos.some((el) => el.nome === value.nome)) {
      return message.error(`Plano "${value.nome}" já adicionado`);
    }

    setPlanos([...planos, value]);
  }

  const removePlano = (nome) => {
    setPlanos(planos.filter((el) => el.nome !== nome));
  }

  return (
    <span>
      <span onClick={modal}
        style={{ cursor: 'pointer' }}>
        {children}
      </span>
      <Modal open={visible}
        title='Cadastro do Paciente'
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
              <Col span={24}
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  opacity: 0.8,
                }}>
                Dados Pessoais
              </Col>
              <Col span={14}>
                <Form.Item name='nome'
                  rules={[{ required: true, message: 'Campo obrigatório' }]}>
                  <Input placeholder='Nome completo' />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item name='cpf'>
                  <Input maxLength={11}
                    placeholder='CPF' />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item name='dtNascimento'>
                  <DatePicker placeholder='Nascimento' />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name='endereco'>
                  <Input placeholder='Endereço' />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name='cidade'>
                  <Input placeholder='Cidade' />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name='numero'>
                  <InputNumber min={0}
                    precision={0}
                    placeholder='Nº'
                    controls={false}
                    style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item name='complemento'>
                  <Input placeholder='Complemento' />
                </Form.Item>
              </Col>
              <Col span={24}
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  opacity: 0.8,
                  marginTop: 10,
                }}>
                Métricas
              </Col>
              <Col span={4}>
                <Form.Item name='peso'>
                  <InputNumber min={0}
                    precision={1}
                    placeholder='Peso'
                    decimalSeparator=','
                    suffix='KG'
                    controls={false}
                    style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name='altura'>
                  <InputNumber min={0}
                    precision={0}
                    placeholder='Altura'
                    decimalSeparator=','
                    suffix='cm'
                    controls={false}
                    style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={17}>
                <Form.Item name='objetivo'>
                  <Input placeholder='Objetivo' />
                </Form.Item>
              </Col>
              {id ? (
                <React.Fragment>
                  <Col>
                    <AdicionarPlano onClose={addPlano}>
                      <Button>
                        Adicionar Plano
                      </Button>
                    </AdicionarPlano>
                  </Col>
                  <Col span={24}>
                    <Table size='small'
                      columns={columns}
                      dataSource={planos}
                      pagination={false}
                      rowKey='nome'
                      scroll={{ x: 550 }} />
                  </Col>
                </React.Fragment>
              ) : null}
            </Row>
          </Spin>
        </Form>
      </Modal>
    </span>
  );
}