import React, { useState } from 'react';
import { Row, Modal, Form, Spin, Col, Input, message } from 'antd';
import request from '../../utils/request';
import DatePicker from '../../components/DatePicker';

export default function Cadastro({ pacienteId, onClose, children }) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const modal = (e) => {
    e.stopPropagation();
    setVisible(true);
  }

  const handleSubmit = (values) => {
    request(`/plano-meta/${pacienteId}`, {
      method: 'POST',
      body: values,
    }).then((result) => {
      message.success('Plano cadastrado com sucesso');
      handleClear();
      onClose?.(result);
    }).catch((err) => {
      Modal.error({
        title: 'Erro ao cadastrar plano!',
        content: err.message,
      });
    });
  }

  const handleClear = () => {
    form.resetFields();
    setLoading(false);
    setVisible(false);
  }

  return (
    <span>
      <span onClick={modal}
        style={{ cursor: 'pointer' }}>
        {children}
      </span>
      <Modal open={visible}
        title='Novo Plano'
        okText='Próximo'
        onCancel={handleClear}
        onOk={form.submit}
        width={600}>
        <Form form={form}
          layout='vertical'
          onFinish={handleSubmit}>
          <Spin spinning={loading}>
            <Row gutter={[10, 5]}>
              <Col span={24}>
                <Form.Item name='nomePlano'
                  label='Nome do Plano'
                  rules={[{ required: true, message: 'Campo obrigatório' }]}>
                  <Input placeholder='Nome do Plano' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='dtInicial'
                  label='Data Inicial'
                  rules={[{ required: true, message: 'Campo obrigatório' }]}>
                  <DatePicker placeholder='Data Inicial'
                    style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='qtdDiariaCalorias'
                  label='Calorias'
                  rules={[{ required: true, message: 'Campo obrigatório' }]}>
                  <Input placeholder='Calorias'
                    type='number' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='qtdDiariaCarboidratos'
                  label='Carboidratos'
                  rules={[{ required: true, message: 'Campo obrigatório' }]}>
                  <Input placeholder='Carboidratos'
                    type='number' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='qtdDiariaGordura'
                  label='Gordura'
                  rules={[{ required: true, message: 'Campo obrigatório' }]}>
                  <Input placeholder='Gordura'
                    type='number' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='qtdDiariaProteina'
                  label='Proteína'
                  rules={[{ required: true, message: 'Campo obrigatório' }]}>
                  <Input placeholder='Proteína'
                    type='number' />
                </Form.Item>
              </Col>
            </Row>
          </Spin>
        </Form>
      </Modal>
    </span>
  );
}