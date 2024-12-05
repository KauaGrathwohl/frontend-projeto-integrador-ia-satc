import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Modal, Spin, Button, Col, Input, Table, Form } from 'antd';
import { PlusOutlined, RightCircleFilled } from '@ant-design/icons';
import { cpfMask } from "../../utils/mask.js";
import request from "../../utils/request.js";
import Cadastro from './Cadastro.jsx';

export default function Detalhes({ pacienteId, children }) {
  const [visible, setVisible] = useState(false);
  const [loadingPaciente, setLoadingPaciente] = useState(false);
  const [loadingPlanos, setLoadingPlanos] = useState(false);
  const [data, setData] = useState([]);
  const [formPaciente] = Form.useForm();
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
    {
      title: 'Acessar',
      dataIndex: 'id',
      key: 'id',
      width: 50,
      render: (_, row) => row.dtFinalMeta ? '' : (
        <Row gutter={[5, 5]} justify='center'>
          <Col span={24}>
            <Button type="link" onClick={() => acessaPlano(row.id)} icon={<RightCircleFilled />} />
          </Col>
        </Row>
      ),
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

  const onPlano = (plano) => {
    fetchPlanos();

    Modal.confirm({
      title: 'Atenção!',
      content: 'Deseja acessar o novo plano cadastrado?',
      onOk: () => acessaPlano(plano.id),
    });
  }

  const acessaPlano = (id) => {
    navigate(`/app/plano-meta/${id}/listagem`);
  }

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
              <Cadastro pacienteId={pacienteId} onClose={onPlano}>
                <Button type="primary" icon={<PlusOutlined />}>
                  Novo Plano
                </Button>
              </Cadastro>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ marginTop: 10 }}>
              <Table size="small" columns={columns} dataSource={data} pagination={false} rowKey="id" />
            </Col>
          </Row>
        </Spin>
      </Modal>
    </span>
  );
}