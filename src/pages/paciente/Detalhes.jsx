import React, { useState } from 'react';
import { Row, Modal, Form, Spin, Col, Input, InputNumber } from 'antd';
import request from '../../utils/request';
import DatePicker from '../../components/DatePicker';
import { cpfMask } from '../../utils/mask.js'

export default function Detalhes({ id, onClose, children }) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

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

    request(`/paciente/detalhes/${id}`, {
      method: 'GET',
    }).then((data) => {
      setLoading(false);
      let body = {...data, cpf: cpfMask(data.cpf)}
      form.setFieldsValue(body);
    }).catch((err) => {
      setLoading(false);
      Modal.error({
        title: 'Erro!',
        content: err,
      });
    });
  }

  const removeCpfMask = (value) => {
    return value.replace(/\D/g, '');
  };

  const handleSubmit = (values) => {
    setSaving(true);

    let url = '/paciente';

    if (id) {
      url += `/${id}`;
    }

    let bodyParam = {...values, cpf: removeCpfMask(values.cpf), id: id};

    request(url, {
      method: id ? 'PUT' : 'POST',
      body: bodyParam,
    }).then(() => {
      setSaving(false);
      handleClear();
      onClose?.();
    }).catch((err) => {
      setSaving(false);
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
  }

  const handleChange = (e) => {
    form.setFieldValue('cpf', cpfMask(e.target.value))
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
        confirmLoading={saving}
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
                <Form.Item name='cpf'
                           onChange={handleChange}
                  rules={[{ required: true, message: 'Campo obrigatório' }]}>
                  <Input maxLength={14}
                    placeholder='CPF' />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item name='dtNascimento'
                  rules={[{ required: true, message: 'Campo obrigatório' }]}>
                  <DatePicker placeholder='Nascimento' />
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
                <Form.Item name='peso'
                  rules={[{ required: true, message: 'Campo obrigatório' }]}>
                  <InputNumber min={0}
                    max={999.99}
                    precision={2}
                    placeholder='Peso'
                    decimalSeparator=','
                    suffix='KG'
                    controls={false}
                    style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name='altura'
                  rules={[{ required: true, message: 'Campo obrigatório' }]}>
                  <InputNumber min={0}
                    max={299.99}
                    precision={2}
                    placeholder='Altura'
                    decimalSeparator=','
                    suffix='cm'
                    controls={false}
                    style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={17}>
                <Form.Item name='objetivo'
                  rules={[{ required: true, message: 'Campo obrigatório' }]}>
                  <Input placeholder='Objetivo' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='restricoes'
                  rules={[{ required: true, message: 'Campo obrigatório' }]}>
                  <Input placeholder='Restrições' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='preferencias'
                  rules={[{ required: true, message: 'Campo obrigatório' }]}>
                  <Input placeholder='Preferências' />
                </Form.Item>
              </Col>
            </Row>
          </Spin>
        </Form>
      </Modal>
    </span>
  );
}