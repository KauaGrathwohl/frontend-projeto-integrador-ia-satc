import React, { useState } from 'react';
import { Row, Modal, Spin, Button, Col, Input, message, Table, Form, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { cpfMask } from "../../utils/mask.js";
import { useNavigate } from 'react-router-dom';
import request from "../../utils/request.js";

export default function Detalhes({ pacienteId, children }) {
  const [visible, setVisible] = useState(false);
  const [visibleNovoPlano, setVisibleNovoPlano] = useState(false);
  const [loadingPaciente, setLoadingPaciente] = useState(false);
  const [loadingPlanos, setLoadingPlanos] = useState(false);
  const [data, setData] = useState([]);
  const [formPaciente] = Form.useForm();
  const [formPlano] = Form.useForm();
  const navigate = useNavigate();

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
  };

  const fetchPlanos = () => {
    if (!pacienteId) return;

    setLoadingPlanos(true);

    request(`/plano-meta/${pacienteId}`, {
      method: 'GET',
    })
        .then((data) => {
          setLoadingPlanos(false);
          setData(data);
        })
        .catch((err) => {
          setLoadingPlanos(false);
          Modal.error({
            title: 'Erro!',
            content: err,
          });
        });
  };

  const fetchPaciente = () => {
    if (!pacienteId) return;

    setLoadingPaciente(true);

    request(`/paciente/detalhes/${pacienteId}`, {
      method: 'GET',
    })
        .then((data) => {
          setLoadingPaciente(false);
          let body = { ...data, cpf: cpfMask(data.cpf) };
          formPaciente.setFieldsValue(body);
        })
        .catch((err) => {
          setLoadingPaciente(false);
          Modal.error({
            title: 'Erro!',
            content: err,
          });
        });
  };

  const postNovoPlano = (idPaciente, novoPlanoData) => {
    request(`/plano-meta/${idPaciente}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novoPlanoData),
    })
        .then(() => {
          message.success('Plano cadastrado com sucesso');
          fetchPlanos();
          navigate('/app/plano-meta/listagem'); // Navegar para a nova tela
        })
        .catch((err) => {
          message.error('Erro ao cadastrar plano: ' + (err.message || err));
        });
  };

  const handleNovoPlanoClick = () => {
    setVisibleNovoPlano(true);
  };

  const handleCancelNovoPlano = () => {
    setVisibleNovoPlano(false);
    formPlano.resetFields();
  };

  const handleSubmitNovoPlano = (values) => {
    postNovoPlano(pacienteId, values);
    setVisibleNovoPlano(false);
  };

  const handleClear = () => {
    formPaciente.resetFields();
    setVisible(false);
    setData([]);
  };

  return (
      <span>
      <span onClick={modal} style={{ cursor: 'pointer' }}>
        {children}
      </span>
      <Modal
          open={visible}
          title="Detalhes do paciente"
          okText="Salvar"
          centered
          destroyOnClose
          onCancel={handleClear}
          width={1000}
          footer={<Button onClick={handleClear}>Fechar</Button>}
      >
        <Form form={formPaciente} layout="vertical">
          <Spin spinning={loadingPaciente}>
            <Row gutter={[10, 5]}>
              <Col span={14}>
                <Form.Item name="nome" rules={[{ required: true, message: 'Campo obrigatório' }]}>
                  <Input placeholder="Nome completo" disabled />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item name="cpf" rules={[{ required: true, message: 'Campo obrigatório' }]}>
                  <Input maxLength={14} placeholder="CPF" disabled />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item name="dtNascimento" rules={[{ required: true, message: 'Campo obrigatório' }]}>
                  <Input placeholder="Nascimento" disabled />
                </Form.Item>
              </Col>
            </Row>
          </Spin>
        </Form>
        <Spin spinning={loadingPlanos}>
          <Row justify={"end"}>
            <Col span={4} style={{ textAlign: 'right' }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleNovoPlanoClick}>
                Novo Plano
              </Button>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ marginTop: 10 }}>
              <Table size="small" columns={columns} dataSource={data} pagination={false} rowKey="id" />
            </Col>
          </Row>
        </Spin>
      </Modal>

      <Modal
          open={visibleNovoPlano}
          title="Novo Plano"
          okText="Próximo"
          onCancel={handleCancelNovoPlano}
          onOk={() => formPlano.submit()}
          width={600}
          footer={[
            <Button key="back" onClick={handleCancelNovoPlano}>
              Cancelar
            </Button>,
            <Button key="submit" type="primary" onClick={() => formPlano.submit()}>
              Próximo
            </Button>,
          ]}
      >
        <Form form={formPlano} layout="vertical" onFinish={handleSubmitNovoPlano}>
          <Row gutter={[10, 5]}>
            <Col span={24}>
              <Form.Item
                  name="nomePlano"
                  label="Nome do Plano"
                  rules={[{ required: true, message: 'Campo obrigatório' }]}
              >
                <Input placeholder="Nome do Plano" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                  name="dtInicial"
                  label="Data Inicial"
                  rules={[{ required: true, message: 'Campo obrigatório' }]}
              >
                <DatePicker placeholder="Data Inicial" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                  name="qtdDiariaCalorias"
                  label="Calorias"
                  rules={[{ required: true, message: 'Campo obrigatório' }]}
              >
                <Input placeholder="Calorias" type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                  name="qtdDiariaCarboidratos"
                  label="Carboidratos"
                  rules={[{ required: true, message: 'Campo obrigatório' }]}
              >
                <Input placeholder="Carboidratos" type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                  name="qtdDiariaGordura"
                  label="Gordura"
                  rules={[{ required: true, message: 'Campo obrigatório' }]}
              >
                <Input placeholder="Gordura" type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                  name="qtdDiariaProteina"
                  label="Proteína"
                  rules={[{ required: true, message: 'Campo obrigatório' }]}
              >
                <Input placeholder="Proteína" type="number" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </span>
  );
}