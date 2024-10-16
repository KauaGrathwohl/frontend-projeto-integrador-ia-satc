import React, { useState } from 'react';
import { Row, Modal, Form, Col, InputNumber, Input } from 'antd';
import DatePicker from '../../components/DatePicker';


export default function AdicionarPlano({ data, onClose, children }) {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const modal = (e) => {
    e.stopPropagation();
    setVisible(true);

    if (data) {
      form.setFieldsValue(data);
    }
  }

  const handleSubmit = (values) => {
    onClose(values);
    handleClear();
  }

  const handleClear = () => {
    form.resetFields();
    setVisible(false);
  }

  return (
    <span>
      <span onClick={modal}
        style={{ cursor: 'pointer' }}>
        {children}
      </span>
      <Modal open={visible}
        title='Cadastro de Plano'
        okText='Inserir'
        centered
        destroyOnClose
        onCancel={handleClear}
        onOk={form.submit}
        width={850}>
        <Form form={form}
          layout='vertical'
          onFinish={handleSubmit}>
          <Row gutter={[10, 5]}>
            <Col span={14}>
              <Form.Item name='nome'
                label='Nome'
                rules={[{ required: true, message: 'Campo obrigatório' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name='dhInicio'
                label='Início'>
                <DatePicker />
              </Form.Item>
            </Col>
            <Col span={24}
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                opacity: 0.8,
                marginTop: 10,
              }}>
              Informações Nutricionais Diárias
            </Col>
            <Col span={6}>
              <Form.Item name='calorias'
                label='Calorias'>
                <InputNumber min={0}
                  precision={1}
                  suffix='KG'
                  decimalSeparator=','
                  controls={false}
                  style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name='carboidratos'
                label='Carboidratos'>
                <InputNumber min={0}
                  precision={1}
                  suffix='KG'
                  decimalSeparator=','
                  controls={false}
                  style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name='gordura'
                label='Gordura'>
                <InputNumber min={0}
                  precision={2}
                  suffix='KG'
                  decimalSeparator=','
                  controls={false}
                  style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name='proteina'
                label='Proteina'>
                <InputNumber min={0}
                  precision={2}
                  suffix='KG'
                  decimalSeparator=','
                  controls={false}
                  style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='restricoes'>
                <Input placeholder='Restrições' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='preferencias'>
                <Input placeholder='Preferências' />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </span>
  );
}