import React, { useState } from 'react';
import { Row, Modal, Spin, Button, Col, Input, message, Table, Form } from 'antd';
import DatePicker from '../../components/DatePicker';
import request from '../../utils/request';
import {cpfMask} from "../../utils/mask.js";
import { PlusOutlined } from '@ant-design/icons';

export default function Detalhes({ pacienteId, children }) {
  const [visible, setVisible] = useState(false);
  const [loadingPaciente, setLoadingPaciente] = useState(false);
  const [loadingPlanos, setLoadingPlanos] = useState(false);
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
      fetchPaciente();
      fetchPlanos();
    }
  }

  const fetchPlanos = () => {
    if (!pacienteId) {
      return;
    }

    setLoadingPlanos(true);

    request(`/plano-meta/${pacienteId}`, {
      method: 'GET',
    }).then((data) => {
      setLoadingPlanos(false);
      setData(data);
    }).catch((err) => {
      setLoadingPlanos(false);
      Modal.error({
        title: 'Erro!',
        content: err,
      });
    });
  }

  const fetchPaciente = () => {
    if (!pacienteId) {
      return;
    }

    setLoadingPaciente(true);

    request(`/paciente/detalhes/${pacienteId}`, {
      method: 'GET',
    }).then((data) => {
      setLoadingPaciente(false);
      let body = {...data, cpf: cpfMask(data.cpf)}
      form.setFieldsValue(body);
    }).catch((err) => {
      setLoadingPaciente(false);
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
        title='Detalhes do paciente'
        okText='Salvar'
        centered
        destroyOnClose
        onCancel={handleClear}
        width={1000}
        footer={<Button onClick={handleClear}>
                  Fechar
                </Button>}>
        <Form form={form}
              layout='vertical'>
          <Spin spinning={loadingPaciente}>
            <Row gutter={[10, 5]}>
              <Col span={14}>
                <Form.Item name='nome'
                           rules={[{ required: true, message: 'Campo obrigatório' }]}>
                  <Input placeholder='Nome completo' disabled/>
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item name='cpf'
                           rules={[{ required: true, message: 'Campo obrigatório' }]}>
                  <Input maxLength={14}
                         placeholder='CPF' disabled/>
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item name='dtNascimento'
                           rules={[{ required: true, message: 'Campo obrigatório' }]}>
                  <DatePicker placeholder='Nascimento' disabled/>
                </Form.Item>
              </Col>
            </Row>
          </Spin>
        </Form>
        <Spin spinning={loadingPlanos}>
          <Row justify={"end"}>
            <Col span={4} style={{textAlign: 'right'}}>
              <Button type="primary" icon={<PlusOutlined />}>Novo Plano</Button>
            </Col>
          </Row>
          <Row>
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
      </Modal>
    </span>
  );
}